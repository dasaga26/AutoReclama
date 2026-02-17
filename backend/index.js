const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de datos SQLite
const db = new Database(path.join(__dirname, 'autoreclama.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Crear tablas
db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        dni TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT NOT NULL,
        fecha_registro TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'pendiente'
    );

    CREATE TABLE IF NOT EXISTS vehiculos (
        id TEXT PRIMARY KEY,
        matricula TEXT UNIQUE NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        anio INTEGER NOT NULL,
        color TEXT,
        puertas INTEGER,
        observaciones TEXT,
        cliente_id TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    );
`);

// Marcas afectadas por el cartel (2006-2013)
const MARCAS_AFECTADAS = [
    'Seat', 'Volkswagen', 'Audi', 'BMW', 'Mercedes',
    'Renault', 'Peugeot', 'Citroën', 'Ford', 'Opel',
    'Toyota', 'Hyundai', 'Fiat', 'Skoda', 'Nissan',
    'Kia', 'Volvo', 'Honda', 'Mazda', 'Chevrolet'
];

function generarId() {
    return crypto.randomUUID();
}

// ========== VERIFICAR ELEGIBILIDAD ==========

app.get('/api/verificar', (req, res) => {
    const { marca, anio } = req.query;

    if (!marca || !anio) {
        return res.status(400).json({ error: 'Marca y año son obligatorios' });
    }

    const anioNum = parseInt(anio);
    const elegible = MARCAS_AFECTADAS.includes(marca) && anioNum >= 2006 && anioNum <= 2013;

    res.json({
        elegible,
        marca,
        anio: anioNum,
        mensaje: elegible
            ? 'Tu vehículo está afectado por el cártel de coches. Puedes registrar tu reclamación.'
            : 'Tu vehículo no está afectado por el cártel o no cumple los requisitos de fecha.'
    });
});

// ========== RECLAMACIONES (USUARIO) ==========

// Crear reclamación (cliente + vehículo en una transacción)
app.post('/api/reclamaciones', (req, res) => {
    const { dni, nombre, apellidos, telefono, email, matricula, marca, modelo, anio, color, puertas, observaciones } = req.body;

    const crearReclamacion = db.transaction(() => {
        // Comprobar si el cliente ya existe por DNI
        let cliente = db.prepare('SELECT * FROM clientes WHERE dni = ?').get(dni);

        if (!cliente) {
            const clienteId = generarId();
            db.prepare(`
                INSERT INTO clientes (id, dni, nombre, apellidos, telefono, email, fecha_registro, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
            `).run(clienteId, dni, nombre, apellidos, telefono, email, new Date().toISOString().split('T')[0]);
            cliente = { id: clienteId };
        }

        // Comprobar matricula duplicada
        const vehiculoExistente = db.prepare('SELECT * FROM vehiculos WHERE matricula = ?').get(matricula);
        if (vehiculoExistente) {
            throw new Error('Ya existe un vehículo con esa matrícula');
        }

        const vehiculoId = generarId();
        db.prepare(`
            INSERT INTO vehiculos (id, matricula, marca, modelo, anio, color, puertas, observaciones, cliente_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(vehiculoId, matricula.toUpperCase(), marca, modelo, parseInt(anio), color || null, puertas ? parseInt(puertas) : null, observaciones || null, cliente.id);

        return { clienteId: cliente.id, vehiculoId };
    });

    try {
        const resultado = crearReclamacion();
        res.status(201).json({ ok: true, mensaje: 'Reclamación registrada correctamente', ...resultado });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Consultar reclamaciones por DNI
app.get('/api/reclamaciones/:dni', (req, res) => {
    const cliente = db.prepare('SELECT * FROM clientes WHERE dni = ?').get(req.params.dni);
    if (!cliente) {
        return res.status(404).json({ error: 'No se encontraron reclamaciones con ese DNI' });
    }

    const vehiculos = db.prepare('SELECT * FROM vehiculos WHERE cliente_id = ?').all(cliente.id);

    res.json({ cliente, vehiculos });
});

// Añadir otro vehículo a un cliente existente (por DNI)
app.post('/api/reclamaciones/:dni/vehiculos', (req, res) => {
    const cliente = db.prepare('SELECT * FROM clientes WHERE dni = ?').get(req.params.dni);
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const { matricula, marca, modelo, anio, color, puertas, observaciones } = req.body;

    const vehiculoExistente = db.prepare('SELECT * FROM vehiculos WHERE matricula = ?').get(matricula);
    if (vehiculoExistente) {
        return res.status(400).json({ error: 'Ya existe un vehículo con esa matrícula' });
    }

    try {
        const vehiculoId = generarId();
        db.prepare(`
            INSERT INTO vehiculos (id, matricula, marca, modelo, anio, color, puertas, observaciones, cliente_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(vehiculoId, matricula.toUpperCase(), marca, modelo, parseInt(anio), color || null, puertas ? parseInt(puertas) : null, observaciones || null, cliente.id);

        res.status(201).json({ ok: true, vehiculoId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ========== ADMIN ==========

app.post('/api/admin/login', (req, res) => {
    const { usuario, password } = req.body;
    if (usuario === 'admin' && password === 'admin1234') {
        return res.json({ ok: true, mensaje: 'Login correcto' });
    }
    res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
});

// Listar todos los clientes
app.get('/api/admin/clientes', (req, res) => {
    const clientes = db.prepare('SELECT * FROM clientes ORDER BY fecha_registro DESC').all();
    res.json(clientes);
});

// Obtener vehículos de un cliente
app.get('/api/admin/clientes/:id/vehiculos', (req, res) => {
    const vehiculos = db.prepare('SELECT * FROM vehiculos WHERE cliente_id = ?').all(req.params.id);
    res.json(vehiculos);
});

// Cambiar estado de resolución
app.put('/api/admin/clientes/:id/estado', (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en trámite', 'resuelto', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido' });
    }

    const result = db.prepare('UPDATE clientes SET estado = ? WHERE id = ?').run(estado, req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Estado actualizado' });
});

// Eliminar cliente (cascada elimina vehículos)
app.delete('/api/admin/clientes/:id', (req, res) => {
    const result = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ ok: true, mensaje: 'Cliente y sus vehículos eliminados' });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
