<template>
  <section class="container" style="margin-block: 1.2rem;">
    <div class="card">
      <h2 style="margin-top:0;margin-bottom:.5rem;">Registrar venta</h2>
      <p style="margin-top:0;color:#505766;">
        Completa los campos y agrega los productos vendidos.
      </p>

      <form @submit.prevent="enviar" class="row row-2" autocomplete="off">
        <!-- Sucursal -->
        <div>
          <label class="label" for="sucursal">Sucursal</label>
          <select id="sucursal" class="input" v-model.number="form.id_sucursal" required>
            <option disabled value="">Selecciona una sucursal</option>
            <option v-for="s in sucursales" :key="s.id" :value="s.id">
              {{ s.nombre }}
            </option>
          </select>
        </div>

        <!-- Fecha -->
        <div>
          <label class="label" for="fecha">Fecha</label>
          <input id="fecha" class="input" type="date" v-model="form.fecha" required />
        </div>

        <!-- NIT -->
        <div>
          <label class="label" for="nit">NIT</label>
          <input id="nit" class="input" type="text" v-model.trim="form.nit" maxlength="20" required />
        </div>

        <!-- Nombre -->
        <div>
          <label class="label" for="nombre">Nombre del cliente</label>
          <input id="nombre" class="input" type="text" v-model.trim="form.nombre" maxlength="100" required />
        </div>

        <!-- Total -->
        <div style="grid-column: 1 / -1;">
          <label class="label" for="totalq">Total Q</label>
          <input id="totalq" class="input" type="number" step="0.01" v-model.number="form.totalq" readonly />
        </div>

        <!-- Sección Detalles -->
        <div style="grid-column: 1 / -1; margin-top: 1rem;">
          <h3>Detalles de venta</h3>

          <div
            v-for="(detalle, i) in form.venta_detalles"
            :key="i"
            class="card"
            style="margin-bottom:.5rem;padding:.8rem;"
          >
            <div class="row row-3">
              <!-- Producto -->
              <div>
                <label class="label" for="producto">Producto</label>
                <select
                  id="producto"
                  class="input"
                  v-model.number="detalle.id_producto"
                  @change="asignarPrecio(detalle)"
                  required
                >
                  <option disabled value="">Selecciona un producto</option>
                  <option v-for="p in productos" :key="p.id" :value="p.id">
                    {{ p.nombre }}
                  </option>
                </select>
              </div>

              <!-- Cantidad -->
              <div>
                <label class="label">Cantidad</label>
                <input
                  class="input"
                  v-model.number="detalle.cantidad"
                  min="1"
                  required
                  @input="calcularSubtotal(detalle)"
                />
              </div>

              <!-- Precio unitario -->
              <div>
                <label class="label">Precio unitario</label>
                <input
                  class="input"
                  v-model.number="detalle.precio_unitario"
                  step="0.01"
                  min="0"
                  required
                  readonly
                />
              </div>
            </div>

            <p style="margin-top:.4rem;">
              <strong>Subtotal:</strong> Q{{ detalle.subtotal.toFixed(2) }}
            </p>

            <button
              type="button"
              class="btn"
              style="background:#b00020;color:white"
              @click="eliminarDetalle(i)"
            >
              Eliminar
            </button>
          </div>

          <button type="button" class="btn btn-primary" @click="agregarDetalle">
            Agregar producto
          </button>
        </div>

        <!-- Botones -->
        <div
          style="grid-column: 1 / -1; display:flex; gap:.6rem; align-items:center; justify-content:flex-start; margin-top:1rem;"
        >
          <button class="btn btn-primary" :disabled="cargando">
            {{ cargando ? 'Enviando...' : 'Registrar venta' }}
          </button>
          <button class="btn" type="button" @click="resetear" :disabled="cargando">Limpiar</button>
        </div>
      </form>

      <!-- Respuesta -->
      <details v-if="respuesta" style="margin-top:1rem;">
        <summary><strong>Respuesta</strong></summary>
        <pre
          style="white-space:pre-wrap;background:#0f172a; color:#e2e8f0; padding:1rem; border-radius:.6rem; overflow:auto;"
        >
{{ respuestaBonita }}
        </pre>
      </details>

      <p v-if="error" style="margin-top:1rem; color:#b00020; font-weight:600;">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { ApiVenta } from '../services/apiVehiculo'

const form = reactive({
  id_sucursal: '',
  fecha: new Date().toISOString().split('T')[0],
  nit: '',
  nombre: '',
  totalq: 0,
  venta_detalles: []
})

const sucursales = ref([])
const productos = ref([])
const cargando = ref(false)
const respuesta = ref(null)
const error = ref('')

// Mostrar respuesta bonita
const respuestaBonita = computed(() =>
  typeof respuesta.value === 'string'
    ? respuesta.value
    : JSON.stringify(respuesta.value, null, 2)
)

// Montaje inicial
onMounted(async () => {
  await listarSucursales()
  await listarProductos()
})

// Listar sucursales
async function listarSucursales() {
  try {
    cargando.value = true
    const data = await ApiVenta.ListarSucursales()
    sucursales.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err?.message ?? 'Error al listar sucursales'
  } finally {
    cargando.value = false
  }
}

// Listar productos
async function listarProductos() {
  try {
    cargando.value = true
    const data = await ApiVenta.ListarProductos()
    productos.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err?.message ?? 'Error al listar productos'
  } finally {
    cargando.value = false
  }
}

// Agregar detalle
function agregarDetalle() {
  form.venta_detalles.push({
    id_producto: '',
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0
  })
}

// Asignar precio al seleccionar producto
function asignarPrecio(detalle) {
  const prod = productos.value.find(p => p.id === detalle.id_producto)
  if (prod) {
    detalle.precio_unitario = parseFloat(prod.precio_unitario) || 0
    calcularSubtotal(detalle)
  }
}

// Calcular subtotal
function calcularSubtotal(detalle) {
  detalle.subtotal = detalle.cantidad * detalle.precio_unitario
  calcularTotal()
}

// Calcular total general
function calcularTotal() {
  form.totalq = form.venta_detalles.reduce((acc, d) => acc + d.subtotal, 0)
}

// Eliminar detalle
function eliminarDetalle(index) {
  form.venta_detalles.splice(index, 1)
  calcularTotal()
}

// Resetear formulario
function resetear() {
  form.id_sucursal = ''
  form.fecha = new Date().toISOString().split('T')[0]
  form.nit = ''
  form.nombre = ''
  form.totalq = 0
  form.venta_detalles = []
  respuesta.value = null
  error.value = ''
}

// Enviar venta
async function enviar() {
  error.value = ''
  respuesta.value = null
  cargando.value = true
  try {
    const res = await fetch('http://pruebas.somee.com/Venta/CrearVenta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const contentType = res.headers.get('Content-Type') || ''
    const data = contentType.includes('application/json') ? await res.json() : await res.text()
    if (!res.ok) throw new Error(`Error ${res.status}: ${JSON.stringify(data)}`)
    respuesta.value = data
    resetear()
  } catch (err) {
    error.value = err?.message ?? 'Error desconocido'
  } finally {
    cargando.value = false
  }
}
</script>
