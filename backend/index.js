const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas a los archivos JSON
const CLIENTES_FILE = path.join(__dirname, 'data', 'clientes.json');
const VEHICULOS_FILE = path.join(__dirname, 'data', 'vehiculos.json');

// Helpers para leer/escribir JSON
function leerJSON(archivo) {
    try {
        const data = fs.readFileSync(archivo, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function escribirJSON(archivo, data) {
    fs.writeFileSync(archivo, JSON.stringify(data, null, 2), 'utf-8');
}

// ============ CLIENTES ============

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    const clientes = leerJSON(CLIENTES_FILE);
    res.json(clientes);
});

// Obtener un cliente por ID
app.get('/api/clientes/:id', (req, res) => {
    const clientes = leerJSON(CLIENTES_FILE);
    const cliente = clientes.find(c => c.id === req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
});

// Crear cliente
app.post('/api/clientes', (req, res) => {
    const clientes = leerJSON(CLIENTES_FILE);
    const { dni, nombre, apellidos, telefono, email } = req.body;

    // Validar DNI unico
    if (clientes.find(c => c.dni === dni)) {
        return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' });
    }

    const nuevoCliente = {
        id: uuidv4(),
        dni,
        nombre,
        apellidos,
        telefono,
        email,
        fechaRegistro: new Date().toISOString().split('T')[0],
        estado: 'pendiente'
    };

    clientes.push(nuevoCliente);
    escribirJSON(CLIENTES_FILE, clientes);
    res.status(201).json(nuevoCliente);
});

// Actualizar cliente
app.put('/api/clientes/:id', (req, res) => {
    const clientes = leerJSON(CLIENTES_FILE);
    const index = clientes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' });

    clientes[index] = { ...clientes[index], ...req.body, id: clientes[index].id };
    escribirJSON(CLIENTES_FILE, clientes);
    res.json(clientes[index]);
});

// Cambiar estado de resolucion
app.put('/api/clientes/:id/estado', (req, res) => {
    const clientes = leerJSON(CLIENTES_FILE);
    const index = clientes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Cliente no encontrado' });

    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en trámite', 'resuelto', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no valido' });
    }

    clientes[index].estado = estado;
    escribirJSON(CLIENTES_FILE, clientes);
    res.json(clientes[index]);
});

// Eliminar cliente
app.delete('/api/clientes/:id', (req, res) => {
    let clientes = leerJSON(CLIENTES_FILE);
    const existe = clientes.find(c => c.id === req.params.id);
    if (!existe) return res.status(404).json({ error: 'Cliente no encontrado' });

    // Eliminar tambien los vehiculos asociados
    let vehiculos = leerJSON(VEHICULOS_FILE);
    vehiculos = vehiculos.filter(v => v.clienteId !== req.params.id);
    escribirJSON(VEHICULOS_FILE, vehiculos);

    clientes = clientes.filter(c => c.id !== req.params.id);
    escribirJSON(CLIENTES_FILE, clientes);
    res.json({ mensaje: 'Cliente y sus vehiculos eliminados' });
});

// ============ VEHICULOS ============

// Obtener todos los vehiculos
app.get('/api/vehiculos', (req, res) => {
    const vehiculos = leerJSON(VEHICULOS_FILE);
    res.json(vehiculos);
});

// Obtener vehiculos de un cliente
app.get('/api/vehiculos/cliente/:clienteId', (req, res) => {
    const vehiculos = leerJSON(VEHICULOS_FILE);
    const vehiculosCliente = vehiculos.filter(v => v.clienteId === req.params.clienteId);
    res.json(vehiculosCliente);
});

// Crear vehiculo
app.post('/api/vehiculos', (req, res) => {
    const vehiculos = leerJSON(VEHICULOS_FILE);
    const { matricula, marca, modelo, anio, color, puertas, observaciones, clienteId } = req.body;

    // Verificar que el cliente existe
    const clientes = leerJSON(CLIENTES_FILE);
    if (!clientes.find(c => c.id === clienteId)) {
        return res.status(400).json({ error: 'El cliente no existe' });
    }

    // Validar matricula unica
    if (vehiculos.find(v => v.matricula === matricula)) {
        return res.status(400).json({ error: 'Ya existe un vehiculo con esa matricula' });
    }

    const nuevoVehiculo = {
        id: uuidv4(),
        matricula,
        marca,
        modelo,
        anio,
        color,
        puertas,
        observaciones,
        clienteId
    };

    vehiculos.push(nuevoVehiculo);
    escribirJSON(VEHICULOS_FILE, vehiculos);
    res.status(201).json(nuevoVehiculo);
});

// Actualizar vehiculo
app.put('/api/vehiculos/:id', (req, res) => {
    const vehiculos = leerJSON(VEHICULOS_FILE);
    const index = vehiculos.findIndex(v => v.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Vehiculo no encontrado' });

    vehiculos[index] = { ...vehiculos[index], ...req.body, id: vehiculos[index].id };
    escribirJSON(VEHICULOS_FILE, vehiculos);
    res.json(vehiculos[index]);
});

// Eliminar vehiculo
app.delete('/api/vehiculos/:id', (req, res) => {
    let vehiculos = leerJSON(VEHICULOS_FILE);
    const existe = vehiculos.find(v => v.id === req.params.id);
    if (!existe) return res.status(404).json({ error: 'Vehiculo no encontrado' });

    vehiculos = vehiculos.filter(v => v.id !== req.params.id);
    escribirJSON(VEHICULOS_FILE, vehiculos);
    res.json({ mensaje: 'Vehiculo eliminado' });
});

// ============ ADMIN ============

app.post('/api/admin/login', (req, res) => {
    const { usuario, password } = req.body;
    if (usuario === 'admin' && password === 'admin1234') {
        return res.json({ ok: true, mensaje: 'Login correcto' });
    }
    res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
