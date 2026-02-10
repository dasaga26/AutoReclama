<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <!-- Sticky Legal Header -->
<header class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-icons text-primary text-2xl">gavel</span>
<span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LegalClaim<span class="text-primary">.org</span></span>
</div>
<nav class="hidden md:flex items-center gap-8 text-sm font-medium">
<a class="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">How it works</a>
<a class="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Eligible Vehicles</a>
<a class="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Legal Notice</a>
</nav>
<button class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2">
<span class="material-icons text-sm">phone</span>
                Contact Attorneys
            </button>
</div>
</header>
<main class="pt-16">
<!-- Hero Section -->
<section class="relative overflow-hidden py-24 md:py-32">
<!-- Background element -->
<div class="absolute inset-0 pointer-events-none opacity-5">
<div class="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
<div class="absolute top-1/2 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
</div>
<div class="max-w-4xl mx-auto px-6 text-center relative z-10">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                    Update: Claims deadline approaching for 2006-2013 purchases
                </div>
<h1 class="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
                    Check if your vehicle is affected by the <span class="text-primary italic">Car Cartel</span>.
                </h1>
<p class="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Secure compensation for vehicles purchased between 2006 and 2013. Verify your eligibility instantly with our official legal database check.
                </p>
<!-- License Plate Input Group -->
<div class="max-w-xl mx-auto bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-700">
<form class="flex flex-col md:flex-row gap-2" onsubmit="event.preventDefault();">
<div class="relative flex-grow group">
<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span class="material-icons text-slate-400 group-focus-within:text-primary transition-colors">directions_car</span>
</div>
<input aria-label="License Plate Number" class="block w-full pl-10 pr-4 py-4 rounded-lg bg-slate-50 dark:bg-slate-900 border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary sm:text-lg font-mono uppercase tracking-wider" placeholder="ENTER LICENSE PLATE" type="text"/>
</div>
<button class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2" type="submit">
                            Check Eligibility
                            <span class="material-icons text-sm">arrow_forward</span>
</button>
</form>
</div>
<p class="mt-4 text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-1">
<span class="material-icons text-xs">lock</span>
                    Your data is encrypted and used solely for eligibility checks. No obligation.
                </p>
</div>
</section>
<!-- Trust Indicators Bar -->
<section class="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
<div class="max-w-6xl mx-auto px-6 py-8">
<p class="text-center text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">Verified by leading consumer protection law firms</p>
<div class="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
<!-- Placeholder logos using text for demo purposes, representing law firms -->
<div class="flex items-center gap-2">
<span class="material-icons text-3xl">account_balance</span>
<span class="font-bold text-lg">HARVEY &amp; ASSOCIATES</span>
</div>
<div class="flex items-center gap-2">
<span class="material-icons text-3xl">balance</span>
<span class="font-bold text-lg">CONSUMER RIGHTS</span>
</div>
<div class="flex items-center gap-2">
<span class="material-icons text-3xl">verified_user</span>
<span class="font-bold text-lg">LEGAL SHIELD</span>
</div>
<div class="flex items-center gap-2">
<span class="material-icons text-3xl">gavel</span>
<span class="font-bold text-lg">JUSTICE PARTNERS</span>
</div>
</div>
</div>
</section>
<!-- 3-Step Process Module -->
<section class="py-24 bg-white dark:bg-slate-900">
<div class="max-w-6xl mx-auto px-6">
<div class="text-center mb-16">
<h2 class="text-4xl font-bold mb-4 text-slate-900 dark:text-white">The Claim Process</h2>
<p class="text-xl text-slate-600 dark:text-slate-400">Simple, transparent, and completely risk-free.</p>
</div>
<div class="grid md:grid-cols-3 gap-8 relative">
<!-- Connecting line for desktop -->
<div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-slate-200 dark:bg-slate-800 z-0 border-t border-dashed border-slate-300 dark:border-slate-700"></div>
<!-- Step 1 -->
<div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
<div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
<span class="material-icons text-4xl text-primary">search</span>
</div>
<div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Step 01</div>
<h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Check Eligibility</h3>
<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Enter your license plate number to instantly verify if your vehicle model was affected by the cartel pricing.
                        </p>
</div>
<!-- Step 2 -->
<div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
<div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
<span class="material-icons text-4xl text-primary">description</span>
</div>
<div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Step 02</div>
<h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Document Proof</h3>
<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Upload a photo of your purchase proof or lease agreement. Our secure system validates the documents instantly.
                        </p>
</div>
<!-- Step 3 -->
<div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
<div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
<span class="material-icons text-4xl text-primary">gavel</span>
</div>
<div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Step 03</div>
<h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Legal Claim</h3>
<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Our partner attorneys file the formal compensation request on your behalf. You pay nothing unless we win.
                        </p>
</div>
</div>
</div>
</section>
<!-- Stats / Trust Section -->
<section class="py-20 bg-primary text-white relative overflow-hidden">
<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&amp;fit=crop&amp;q=80&amp;w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay" data-alt="Abstract legal scales and gavel background texture"></div>
<div class="max-w-6xl mx-auto px-6 relative z-10">
<div class="grid md:grid-cols-2 gap-12 items-center">
<div>
<h2 class="text-4xl md:text-5xl font-bold mb-6">Justice for Car Owners.</h2>
<p class="text-xl text-blue-100 leading-relaxed mb-8">
                             The automobile manufacturers illegally coordinated pricing strategies, resulting in inflated costs for consumers. We represent over 50,000 vehicle owners in the largest class action lawsuit of the decade.
                         </p>
<ul class="space-y-4">
<li class="flex items-center gap-3">
<span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
<span class="text-lg">No Win, No Fee Guarantee</span>
</li>
<li class="flex items-center gap-3">
<span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
<span class="text-lg">Full Legal Representation Included</span>
</li>
<li class="flex items-center gap-3">
<span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
<span class="text-lg">Average Compensation: €1,250</span>
</li>
</ul>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
<div class="text-4xl font-bold mb-2">€45M+</div>
<div class="text-blue-200 text-sm uppercase tracking-wide">Recovered</div>
</div>
<div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
<div class="text-4xl font-bold mb-2">50k+</div>
<div class="text-blue-200 text-sm uppercase tracking-wide">Clients</div>
</div>
<div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
<div class="text-4xl font-bold mb-2">98%</div>
<div class="text-blue-200 text-sm uppercase tracking-wide">Success Rate</div>
</div>
<div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
<div class="text-4xl font-bold mb-2">24h</div>
<div class="text-blue-200 text-sm uppercase tracking-wide">Process Start</div>
</div>
</div>
</div>
</div>
</section>
<!-- FAQ Accordion -->
<section class="py-24 bg-background-light dark:bg-background-dark">
<div class="max-w-3xl mx-auto px-6">
<h2 class="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
<div class="space-y-4">
<!-- FAQ Item 1 -->
<div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
<details class="group">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="text-lg font-semibold text-slate-800 dark:text-white">Which vehicles are affected?</span>
<span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                Most major brands purchased or leased between 2006 and 2013 are potentially affected. This includes both passenger cars and commercial trucks. Use our checker tool above to confirm your specific model.
                            </div>
</details>
</div>
<!-- FAQ Item 2 -->
<div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
<details class="group">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="text-lg font-semibold text-slate-800 dark:text-white">Is there any cost to check my eligibility?</span>
<span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                No. Checking your eligibility is completely free. Furthermore, we operate on a "No Win, No Fee" basis, meaning you only pay a success fee if we successfully recover compensation for you.
                            </div>
</details>
</div>
<!-- FAQ Item 3 -->
<div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
<details class="group">
<summary class="flex items-center justify-between p-6 cursor-pointer list-none">
<span class="text-lg font-semibold text-slate-800 dark:text-white">What documents do I need?</span>
<span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                You will need proof of ownership or lease for the relevant period (2006-2013). This can be a purchase invoice, lease contract, or registration document. If you have sold the car, you can still claim if you have the historical paperwork.
                            </div>
</details>
</div>
</div>
</div>
</section>
<!-- Final CTA -->
<section class="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
<div class="max-w-4xl mx-auto px-6 text-center">
<h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Don't leave money on the table.</h2>
<p class="text-xl text-slate-600 dark:text-slate-400 mb-8">The legal deadline to file your claim is approaching. It takes less than 2 minutes to verify your right to compensation.</p>
<button class="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 inline-flex items-center gap-2">
                    Check My License Plate Now
                    <span class="material-icons">arrow_forward</span>
</button>
</div>
</section>
</main>
<footer class="bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-slate-800 py-12">
<div class="max-w-6xl mx-auto px-6">
<div class="flex flex-col md:flex-row justify-between items-center mb-8">
<div class="flex items-center gap-2 mb-4 md:mb-0">
<span class="material-icons text-primary">gavel</span>
<span class="text-lg font-bold text-slate-900 dark:text-white">LegalClaim.org</span>
</div>
<div class="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
<a class="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="hover:text-primary transition-colors" href="#">Imprint</a>
</div>
</div>
<div class="text-center md:text-left text-xs text-slate-400 dark:text-slate-600 max-w-2xl">
<p>Disclaimer: LegalClaim.org is a service provided by independent consumer rights attorneys. This website is not affiliated with any government agency or automobile manufacturer. The information provided does not constitute legal advice.</p>
<p class="mt-2">© 2023 LegalClaim Organization. All rights reserved.</p>
</div>
</div>
</footer>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
