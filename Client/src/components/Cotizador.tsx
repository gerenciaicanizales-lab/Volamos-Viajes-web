import React, { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { WA_URI } from "../constants/URIS";

type Tipo = "vuelo" | "hotel" | "paquete";

const tipos: { id: Tipo; label: string }[] = [
  { id: "vuelo", label: "Vuelo" },
  { id: "hotel", label: "Hotel" },
  { id: "paquete", label: "Paquete" },
];

const hoy = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const formatoFecha = (v: string) => {
  if (!v) return "—";
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
};

const inputClass =
  "w-full rounded-md border border-accentBackground bg-white px-3 py-2.5 text-text focus:border-extraBlue focus:outline-none focus:ring-2 focus:ring-extraBlue/30";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-secondary";

const Cotizador: React.FC = () => {
  const [tipo, setTipo] = useState<Tipo>("vuelo");
  const [idaYVuelta, setIdaYVuelta] = useState(true);
  const [origen, setOrigen] = useState("San Salvador (SAL)");
  const [destino, setDestino] = useState("");
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const [clase, setClase] = useState("Económica");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(false);

  const etiquetas = {
    vuelo: { f1: "Fecha de ida", f2: "Fecha de regreso", destino: "Destino" },
    hotel: { f1: "Entrada (check-in)", f2: "Salida (check-out)", destino: "Ciudad u hotel" },
    paquete: { f1: "Fecha aproximada de viaje", f2: "", destino: "Destino o paquete" },
  }[tipo];

  const mensaje = useMemo(() => {
    const l: string[] = [];
    if (tipo === "vuelo") {
      l.push("Hola Volamos Viajes, quiero cotizar un vuelo:");
      l.push(`• Tipo: ${idaYVuelta ? "Ida y vuelta" : "Solo ida"}`);
      l.push(`• Origen: ${origen || "—"}`);
      l.push(`• Destino: ${destino || "—"}`);
      l.push(`• Ida: ${formatoFecha(fecha1)}`);
      if (idaYVuelta) l.push(`• Regreso: ${formatoFecha(fecha2)}`);
      l.push(`• Clase: ${clase}`);
    } else if (tipo === "hotel") {
      l.push("Hola Volamos Viajes, quiero cotizar un hotel:");
      l.push(`• Destino: ${destino || "—"}`);
      l.push(`• Entrada: ${formatoFecha(fecha1)}`);
      l.push(`• Salida: ${formatoFecha(fecha2)}`);
      l.push(`• Habitaciones: ${habitaciones}`);
    } else {
      l.push("Hola Volamos Viajes, quiero cotizar un paquete:");
      l.push(`• Destino: ${destino || "—"}`);
      l.push(`• Fecha aproximada: ${formatoFecha(fecha1)}`);
    }
    l.push(`• Pasajeros: ${adultos} adulto(s), ${ninos} niño(s)`);
    if (nombre.trim()) l.push(`• Nombre: ${nombre.trim()}`);
    return l.join("\n");
  }, [tipo, idaYVuelta, origen, destino, fecha1, fecha2, clase, habitaciones, adultos, ninos, nombre]);

  const enviar = () => {
    if (!destino.trim() || !fecha1) {
      setError(true);
      return;
    }
    setError(false);
    window.open(`${WA_URI}&text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
  };

  const mostrarFecha2 = tipo === "hotel" || (tipo === "vuelo" && idaYVuelta);

  return (
    <section id="cotizador" className="w-full bg-background py-16">
      <div className="mx-auto grid w-[90%] max-w-6xl gap-10 lg:w-[85%] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-extraBlue">Cotizador</span>
          <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">Cotiza tu viaje en un minuto</h2>
          <p className="mt-4 text-text/80">
            Elige si buscas vuelo, hotel o paquete, llena tus datos y el mensaje se arma solo. Lo envías por
            WhatsApp y un asesor te responde con las mejores opciones.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              ["Llena el formulario", "Destino, fechas y pasajeros."],
              ["Envíalo por WhatsApp", "Llega directo a nuestro equipo de ventas."],
              ["Recibe tu cotización", "Te enviamos opciones de horario, tarifa y hotel."],
            ].map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p>
                  <b className="block text-primary">{t}</b>
                  <span className="text-sm text-text/70">{d}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <form
          className="grid min-w-0 gap-4 rounded-2xl border border-accentBackground bg-white p-5 shadow-xl md:p-7"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
        >
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Qué quieres cotizar">
            {tipos.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tipo === t.id}
                onClick={() => setTipo(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tipo === t.id ? "bg-primary text-white" : "bg-sectionBackground text-secondary hover:bg-accentBackground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tipo === "vuelo" && (
            <div className="flex gap-4 text-sm font-medium text-text">
              <label className="flex items-center gap-2">
                <input type="radio" id="cot-ida-vuelta" checked={idaYVuelta} onChange={() => setIdaYVuelta(true)} /> Ida y vuelta
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" id="cot-solo-ida" checked={!idaYVuelta} onChange={() => setIdaYVuelta(false)} /> Solo ida
              </label>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {tipo === "vuelo" && (
              <div className="grid min-w-0 gap-1.5">
                <label htmlFor="cot-origen" className={labelClass}>Origen</label>
                <input id="cot-origen" className={inputClass} value={origen} onChange={(e) => setOrigen(e.target.value)} />
              </div>
            )}
            <div className={`grid min-w-0 gap-1.5 ${tipo === "vuelo" ? "" : "sm:col-span-2"}`}>
              <label htmlFor="cot-destino" className={labelClass}>{etiquetas.destino}</label>
              <input
                id="cot-destino"
                className={inputClass}
                placeholder="Ej. Madrid, Cancún, Cartagena"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1.5">
              <label htmlFor="cot-fecha1" className={labelClass}>{etiquetas.f1}</label>
              <input
                id="cot-fecha1"
                type="date"
                min={hoy()}
                className={inputClass}
                value={fecha1}
                onChange={(e) => setFecha1(e.target.value)}
              />
            </div>
            {mostrarFecha2 && (
              <div className="grid min-w-0 gap-1.5">
                <label htmlFor="cot-fecha2" className={labelClass}>{etiquetas.f2}</label>
                <input
                  id="cot-fecha2"
                  type="date"
                  min={fecha1 || hoy()}
                  className={inputClass}
                  value={fecha2}
                  onChange={(e) => setFecha2(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid min-w-0 gap-1.5">
              <label htmlFor="cot-adultos" className={labelClass}>Adultos</label>
              <select id="cot-adultos" className={inputClass} value={adultos} onChange={(e) => setAdultos(Number(e.target.value))}>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="grid min-w-0 gap-1.5">
              <label htmlFor="cot-ninos" className={labelClass}>Niños</label>
              <select id="cot-ninos" className={inputClass} value={ninos} onChange={(e) => setNinos(Number(e.target.value))}>
                {Array.from({ length: 9 }, (_, i) => i).map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            {tipo === "vuelo" && (
              <div className="grid min-w-0 gap-1.5">
                <label htmlFor="cot-clase" className={labelClass}>Clase</label>
                <select id="cot-clase" className={inputClass} value={clase} onChange={(e) => setClase(e.target.value)}>
                  <option>Económica</option>
                  <option>Premium</option>
                  <option>Ejecutiva</option>
                </select>
              </div>
            )}
            {tipo === "hotel" && (
              <div className="grid min-w-0 gap-1.5">
                <label htmlFor="cot-hab" className={labelClass}>Habitaciones</label>
                <select id="cot-hab" className={inputClass} value={habitaciones} onChange={(e) => setHabitaciones(Number(e.target.value))}>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid min-w-0 gap-1.5">
            <label htmlFor="cot-nombre" className={labelClass}>Tu nombre</label>
            <input
              id="cot-nombre"
              className={inputClass}
              placeholder="Nombre y apellido"
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-1 text-sm text-text/70">Así llegará tu mensaje:</p>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-text">
              {mensaje}
            </pre>
          </div>

          {error && (
            <p className="text-sm font-semibold text-VVorange">
              Escribe el destino y la fecha para enviar tu cotización.
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-VVorange px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-95"
          >
            <FaWhatsapp className="h-5 w-5" /> Enviar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
};

export default Cotizador;
