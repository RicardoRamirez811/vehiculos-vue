<template>
  <section class="container" style="margin-block: 1.2rem;">
    <div class="card">
      <h2 style="margin-top:0;margin-bottom:.5rem;">Crear vehículo</h2>
      <p style="margin-top:0;color:#505766;">
        Completa los 4 campos y envía. Los demás valores del JSON se rellenan con predeterminados.
      </p>

      <form @submit.prevent="enviar" class="row row-2" autocomplete="off">
        <div>
          <label class="label" for="idColor">Id Color</label>
          <input id="idColor" class="input" type="number" v-model.number="form.idColor" min="1" required />
        </div>

        <div>
          <label class="label" for="idMarca">Id Marca</label>
          <input id="idMarca" class="input" type="number" v-model.number="form.idMarca" min="1" required />
        </div>

        <div>
          <label class="label" for="modelo">Modelo</label>
          <input id="modelo" class="input" type="number" v-model.number="form.modelo" min="1900" required />
        </div>

        <div>
          <label class="label" for="nombre">Nombre</label>
          <input id="nombre" class="input" type="text" v-model.trim="form.nombre" maxlength="60" required />
        </div>

        <div style="grid-column: 1 / -1; display:flex; gap:.6rem; align-items:center; justify-content:flex-start; margin-top:.5rem;">
          <button class="btn btn-primary" :disabled="cargando">
            {{ cargando ? 'Enviando...' : 'Enviar a API' }}
          </button>
          <button class="btn" type="button" @click="resetear" :disabled="cargando">Limpiar</button>
        </div>
      </form>

      <details v-if="respuesta" style="margin-top:1rem;">
        <summary><strong>Respuesta</strong></summary>
        <pre style="white-space:pre-wrap;background:#0f172a; color:#e2e8f0; padding:1rem; border-radius:.6rem; overflow:auto;">{{ respuestaBonita }}</pre>
      </details>

      <details style="margin-top:1rem;">
        <summary><strong>JSON que se envía</strong></summary>
        <pre style="white-space:pre-wrap;background:#0f172a; color:#e2e8f0; padding:1rem; border-radius:.6rem; overflow:auto;">{{ jsonBonito }}</pre>
      </details>

      <p v-if="error" style="margin-top:1rem; color:#b00020; font-weight:600;">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ApiVehiculo } from '../services/apiVehiculo'

// 4 campos del formulario
const form = reactive({
  idColor: 1,
  idMarca: 2,
  modelo: 2002,
  nombre: 'DIMATEO'
})

// Valores por defecto para completar el JSON
const defaults = reactive({
  chasis: 'ABC123',
  motor: 'MOTOR123'
})

const cargando = ref(false)
const respuesta = ref(null)
const error = ref('')

// Ensamblar el JSON final según tu requerimiento
const payload = computed(() => ({
  idColor: form.idColor,
  idMarca: form.idMarca,
  modelo: form.modelo,
  chasis: defaults.chasis,
  motor: defaults.motor,
  nombre: form.nombre
}))

const jsonBonito = computed(() => JSON.stringify(payload.value, null, 2))
const respuestaBonita = computed(() => typeof respuesta.value === 'string'
  ? respuesta.value
  : JSON.stringify(respuesta.value, null, 2)
)

function resetear(){
  form.idColor = 1
  form.idMarca = 2
  form.modelo = 2002
  form.nombre = 'DIMATEO'
  defaults.chasis = 'ABC123'
  defaults.motor = 'MOTOR123'
  defaults.activo = 1
  respuesta.value = null
  error.value = ''
}

async function enviar(){
  error.value = ''
  respuesta.value = null
  cargando.value = true
  try{
    const data = await ApiVehiculo.crearVehiculo(payload.value)
    respuesta.value = data
  }catch(err){
    error.value = err?.message ?? 'Error desconocido'
  }finally{
    cargando.value = false
  }
}
</script>
