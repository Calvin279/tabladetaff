class ControlHoras {
    constructor() {
        this.registros = JSON.parse(localStorage.getItem('registros')) || [];
        this.registroBody = document.getElementById('registroBody');
        this.registroForm = document.getElementById('registroForm');
        this.notificaciones = document.getElementById('notificaciones');

        this.inicializarEventos();
        this.renderizarRegistros();
    }

    inicializarEventos() {
        this.registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarHoras();
        });
    }

    registrarHoras() {
        const nombre = document.getElementById('nombre').value;
        const rango = document.getElementById('rango').value;
        const fecha = document.getElementById('fecha').value;
        const horaEntrada = document.getElementById('horaEntrada').value;
        const horaSalida = document.getElementById('horaSalida').value;

        const tiempoTrabajado = this.calcularTiempoTrabajado(horaEntrada, horaSalida);
        const estado = this.evaluarEstado(tiempoTrabajado);

        const registro = {
            nombre,
            rango,
            fecha,
            horaEntrada,
            horaSalida,
            tiempoTrabajado,
            estado
        };

        this.registros.push(registro);
        this.guardarRegistros();
        this.renderizarRegistros();
        this.manejarNotificaciones(estado, nombre);
        this.registroForm.reset();
    }

    calcularTiempoTrabajado(entrada, salida) {
        const [horasEntrada, minutosEntrada] = entrada.split(':').map(Number);
        const [horasSalida, minutosSalida] = salida.split(':').map(Number);

        let totalMinutos = (horasSalida * 60 + minutosSalida) - (horasEntrada * 60 + minutosEntrada);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        return `${horas}h ${minutos}m`;
    }

    evaluarEstado(tiempoTrabajado) {
        const [horas] = tiempoTrabajado.split('h').map(Number);
        return horas >= 3 ? 'cumplido' : 'incumplido';
    }

    renderizarRegistros() {
        this.registroBody.innerHTML = '';
        this.registros.forEach((registro, index) => {
            const fila = document.createElement('tr');
            fila.classList.add(registro.estado);
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.rango}</td>
                <td>${registro.fecha}</td>
                <td>${registro.horaEntrada}</td>
                <td>${registro.horaSalida}</td>
                <td>${registro.tiempoTrabajado}</td>
                <td>${registro.estado === 'cumplido' ? '✓' : '✗'}</td>
            `;
            this.registroBody.appendChild(fila);
        });
    }

    manejarNotificaciones(estado, nombre) {
        if (estado === 'incumplido') {
            const notificacion = document.createElement('div');
            notificacion.classList.add('notificacion');
            notificacion.textContent = `${nombre} no cumplió con las 3 horas mínimas`;
            this.notificaciones.appendChild(notificacion);

            setTimeout(() => {
                this.notificaciones.removeChild(notificacion);
            }, 3000);
        }
    }

    guardarRegistros() {
        localStorage.setItem('registros', JSON.stringify(this.registros));
    }

    buscarEmpleado(nombre) {
        return this.registros.filter(registro => 
            registro.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }
}

window.buscarEmpleado = function() {
    const nombreBusqueda = document.getElementById('searchInput').value;
    const controlHoras = new ControlHoras();
    const resultados = controlHoras.buscarEmpleado(nombreBusqueda);
    
    controlHoras.registroBody.innerHTML = '';
    resultados.forEach(registro => {
        const fila = document.createElement('tr');
        fila.classList.add(registro.estado);
        fila.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.rango}</td>
            <td>${registro.fecha}</td>
            <td>${registro.horaEntrada}</td>
            <td>${registro.horaSalida}</td>
            <td>${registro.tiempoTrabajado}</td>
            <td>${registro.estado === 'cumplido' ? '✓' : '✗'}</td>
        `;
        controlHoras.registroBody.appendChild(fila);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    new ControlHoras();
});