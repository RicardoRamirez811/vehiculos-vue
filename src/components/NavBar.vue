<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <div class="brand">
        <img
          src="../recursos/LogoUMGSF.png"
          alt="Logo"
          class="brand-logo"
        />
        <span class="brand-text">Vehículos</span>
      </div>

      <nav class="nav-actions">
        <!-- Opciones sin uso por ahora -->
        <a class="nav-link" href="VentaForm.vue">Venta</a>
        <a class="nav-link" href="#">Acerca</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
// No necesitamos lógica aún.
</script>

<style scoped>
.navbar{
  background: var(--azul);
  color: var(--blanco);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-inner{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:.8rem 0;
}
.brand{
  display:flex;
  align-items:center;
  gap:.6rem;
}
.brand-logo{
  width:40px; height:40px; border-radius:.6rem; background:#fff;
}
.brand-text{
  font-weight:800;
  letter-spacing:.3px;
}
.nav-actions{
  display:flex; gap:1rem;
}
.nav-link{
  color:var(--blanco);
  text-decoration:none;
  font-weight:600;
  opacity:.95;
}
.nav-link:hover{ opacity:1; text-decoration: underline; }
</style>
