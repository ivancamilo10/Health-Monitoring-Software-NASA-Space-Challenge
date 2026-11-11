# 🧪 NASA SPACE CHALLENGE: MANUAL DE PRUEBAS DE VUELO Y GUION DEL PITCH
**Rol:** Flight Test Officer & Presentation Lead (Especialista de Pruebas No Técnico / QA y Orador de Pitch)  
**Misión:** Asegurar que el software funcione a prueba de balas antes de la presentación, validar la experiencia de usuario y ejecutar la demostración en vivo más impactante frente al jurado de la NASA.

---

## 🚀 1. CÓMO PROBAR EL PROYECTO (SIN TOCAR UNA SOLA LÍNEA DE CÓDIGO)

### Paso 1: Encender la Plataforma
Solo necesitas pedirle a uno de los desarrolladores o ejecutar tú mismo en la terminal:
```bash
npm run dev
```
### Paso 2: Abrir la Cabina de Misión
Abre tu navegador (Chrome, Edge, Firefox) e ingresa a:
👉 `http://localhost:3000`

Deberás ver la pantalla de **"Autonomous Bio-Telemetry & Triage Platform"** con datos activos de la misión Artemis.

---

## 📋 2. MATRIZ DE PRUEBAS DE VUELO (USER ACCEPTANCE TESTING)

Prueba cada uno de los 4 botones de la sección **"HERRAMIENTA DEMO JURADO NASA: INYECCIÓN DE CONTINGENCIAS"** y verifica que la pantalla reaccione exactamente como se indica en esta tabla:

| Botón a Presionar | ¿Qué simula? | ¿Qué DEBES ver en la pantalla si todo funciona? | ¿Pasa la prueba? |
|---|---|---|:---:|
| **🟢 RESTAURAR NOMINAL** | Tripulación descansando en equilibrio. | • Banner superior en **VERDE** ("ESTADO OPERACIONAL NOMINAL").<br>• Risk Score bajo (10 - 25%).<br>• Ritmo cardíaco estable (~70 BPM) y SpO2 &gt; 98%.<br>• Presión de cabina a 14.7 psi. | [ ] |
| **⚠️ FUGA DE TRAJE (EVA)** | Micrometeoroide perfora el traje espacial. | • Banner superior cambia a **ROJO PARPADEANTE** ("EMERGENCY // TRIAGE AUTÓNOMO ACTIVADO").<br>• Tarjeta del Comandante parpadea en rojo con Risk Score &gt; 85%.<br>• Presión de traje cae a 3.2 psi y pulso sube a 154 BPM.<br>• Mensaje de acción autónoma: *"Presurización auxiliar activada a 4.2 psi"*. | [ ] |
| **☣️ TOXICIDAD POR CO2** | Falla del filtro químico de la cabina. | • Banner cambia a **ÁMBAR** ("WARNING // ALERTA AMBIENTAL").<br>• Panel ECLSS marca CO2 en 7.8 mmHg en color de alerta.<br>• Protocolo activado: *"Ventilación máxima forzada de scrubbers LiOH activada"*. | [ ] |
| **☢️ TORMENTA SOLAR (SPE)** | Radiación cósmica letal en espacio profundo. | • Nivel de radiación sube a 145 µSv/h en color rojo/magenta.<br>• Protocolo recomienda evacuación inmediata al refugio blindado (*Storm Shelter*). | [ ] |

---

## 🐞 3. CÓMO REPORTARLE UN ERROR A LOS PROGRAMADORES (SIN ENREDOS)

Si encuentras algo que no cuadra, **no necesitas saber programar**. Solo copia esta plantilla y pégala en el chat del equipo:

```markdown
🚨 REPORTE DE ERROR DE VUELO:
1. ¿Qué botón toqué?: (Ej: Presioné "FUGA DE TRAJE")
2. ¿Qué pasó en pantalla?: (Ej: El botón se quedó bloqueado y la pantalla no cambió a rojo)
3. ¿Qué debió pasar según el manual?: (Debió parpadear en rojo y salir el protocolo EVA-ABORT)
4. Navegador usado: (Chrome / Edge / Safari)
```

---

## 🎤 4. GUION MAESTRO DEL PITCH (3 MINUTOS PARA GANAR EL HACKATHON)

Este es el guion exacto con el que vas a impresionar a los evaluadores de la NASA:

### Minuto 0:00 - 0:45: EL PROBLEMA (La "Trampa de la Latencia")
> *"Buenos días, jurado de la NASA. En la Estación Espacial Internacional, si un astronauta tiene una arritmia o una fuga en su traje, un médico en Houston enciende el micrófono y lo asesora en 2 segundos.*  
> *Pero en una misión hacia Marte o el Polo Sur lunar, las señales de radio tardan entre **4 y 22 minutos** en llegar a la Tierra, y otros 22 minutos en regresar.*  
> *Ante una fuga de traje o un paro cardíaco, **44 minutos es la muerte**. La telemedicina tradicional terrestre es inútil en el espacio profundo."*

### Minuto 0:45 - 1:45: LA DEMOSTRACIÓN EN VIVO (El Efecto "WOW")
*(Muestra la pantalla en proyector con el estado en VERDE).*
> *"Les presentamos nuestra Plataforma de Telemetría y Triaje Médico Autónomo a Bordo.*  
> *Observen la pantalla: en este momento, el comandante Alex Vance está en una caminata espacial nominal... pero imaginemos que un micrometeoroide perfora su guante."*  
> *(PRESIONAS EL BOTÓN EN VIVO: **"⚠️ FUGA DE TRAJE (EVA)"**).*  
> *(La pantalla parpadea en rojo al instante).*  
> *"En menos de **200 milisegundos**, sin esperar respuesta de Houston, la inteligencia a bordo detectó la despresurización a 3.2 psi, reconoció la taquicardia hipóxica, activó la presurización de respaldo de O2 puro y ordenó el retorno al Airlock antes del límite letal de 45 segundos."*

### Minuto 1:45 - 2:30: LA ARQUITECTURA TÉCNICA
> *"Detrás de esta pantalla hay una arquitectura de grado aeroespacial:*  
> *1. Normalización biomédica contextual: no es lo mismo 150 BPM haciendo ejercicio que durmiendo.*  
> *2. Persistencia atómica de incidentes en Supabase para trazabilidad de vuelo.*  
> *3. Modos autónomos y sincronización asíncrona cuando se restablece el enlace con la Tierra."*

### Minuto 2:30 - 3:00: EL CIERRE
> *"Con este sistema, la tripulación de Artemis y los primeros humanos en Marte no viajan solos: viajan con un médico y un ingeniero de soporte vital autónomo a bordo cada milisegundo de su viaje. Muchas gracias."*
