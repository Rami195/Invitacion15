import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate,useScroll } from "framer-motion";
import bgFlowers from "../public/imagen2.jpeg"; // usa tu imagen floral
import bgInvitation from "../public/imagen3.jpeg";
import seccion1 from "../public/seccion1.jpeg";
import seccion2 from "../public/seccion2.jpeg";
import seccion3 from "../public/seccion3.jpeg";
import seccion4 from "../public/seccion4.jpeg";
import seccion5 from "../public/seccion5.jpeg";
import musicaFondo from "../public/Hola.mp3";
import imagen4 from "../public/imagen4.jpg";

// =================== CONFIG FECHA ===================
const EVENT_DATE = new Date("2026-07-04T21:30:00");
const stackImages = [seccion1, seccion2, seccion3, seccion4, seccion5];

// =================== VARIANTS DE ANIMACIÓN ===================
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const textStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// animación para secciones (scroll)
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// =================== CLASE BASE PARA SECCIONES ===================
const SECTION_BASE =
  "py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8";
function AnimatedNumber({ value }) {
  const num = typeof value === "string" ? parseInt(value, 10) || 0 : value ?? 0;

  const count = useMotionValue(num);
  const rounded = useTransform(count, (latest) =>
    String(Math.round(latest)).padStart(2, "0")
  );

  const [display, setDisplay] = React.useState(
    String(num).padStart(2, "0")
  );

  useEffect(() => {
    // cuando cambie el valor, animamos desde el actual hasta el nuevo
    const newNum =
      typeof value === "string" ? parseInt(value, 10) || 0 : value ?? 0;

    const controls = animate(count, newNum, {
      duration: 0.5,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <motion.span style={{ display: "inline-block" }}>
      {display}
    </motion.span>
  );
}

// Componente helper para textos animados
function TextMotion({
  as = "p",
  className = "",
  children,
  ...rest
}) {
  const Tag = motion[as] || motion.p;
  return (
    <Tag
      variants={textVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// =================== INTRO CARD (PRIMERA PANTALLA) ===================
function IntroCard({ onEnter }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgFlowers})` }}
    >
      {/* Oscurecer fondo */}
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        className="relative w-full max-w-md sm:max-w-lg mx-4"
        variants={textStagger}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-slate-300 px-6 py-8 sm:px-8 sm:py-10 text-center">
          <TextMotion
            as="h1"
            className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2"
          >
            Bienvenido a la
            <br />
            invitación
          </TextMotion>

          <TextMotion className="text-sm sm:text-base text-slate-600 mb-6">
            Te invitamos a esta celebración especial
          </TextMotion>

          <motion.div
            className="space-y-3 text-sm sm:text-base text-slate-700 mb-6"
            variants={textStagger}
          >
            <TextMotion className="flex items-center justify-center gap-2">
              <span>👤</span>
              <span>Adelina</span>
            </TextMotion>
            <TextMotion className="flex items-center justify-center gap-2">
              <span>📅</span>
              <span>4 de Julio, 2026</span>
            </TextMotion>
            <TextMotion className="flex items-center justify-center gap-2">
              <span>🕒</span>
              <span>21:30</span>
            </TextMotion>
          </motion.div>

          <motion.button
            onClick={onEnter}
            className="mt-2 w-full rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] text-white text-sm font-medium py-2.5 transition"
            variants={textVariant}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver invitación
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// =================== HOOK COUNTDOWN ===================
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// =================== PhotoStack Component ===================
function PhotoStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = stackImages.length;

  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % total);
  };

  const getPos = (i) => (i - activeIndex + total) % total;

  return (
    <motion.div
      className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl aspect-[4/3] mx-auto cursor-pointer select-none"
      onClick={handleNext}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {stackImages.map((src, i) => {
        const pos = getPos(i);
        const zIndex = total - pos;

        let classes =
          "absolute inset-0 rounded-lg shadow-2xl border border-white/80 overflow-hidden transition-transform duration-500 ease-out bg-white";

        if (pos === 0) {
          // foto de adelante
          classes += " scale-105 translate-y-1";
        } else if (pos === 1) {
          classes += " -rotate-2 -translate-x-4 translate-y-3";
        } else if (pos === 2) {
          classes += " rotate-3 translate-x-3 translate-y-6 scale-95";
        } else {
          classes +=
            " -rotate-1 -translate-x-8 translate-y-8 scale-90 opacity-80";
        }

        return (
          <div key={i} className={classes} style={{ zIndex }}>
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </motion.div>
  );
}

// =================== INVITACIÓN PRINCIPAL ===================
function QuinceInvitation() {
  const countdown = useCountdown(EVENT_DATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [mostrarPrecio, setMostrarPrecio] = useState(false);
  const [mostrarAsistencia, setMostrarAsistencia] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [estadoEnvio, setEstadoEnvio] = useState("idle");
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw41bMYRHq59iDdCB-ROnHj_lmnMTrMSWM-hNZwpwtueMqtTh-keKBSePfdC9QR37M/exec";

  const handleOpenAsistencia = () => {
    setMostrarAsistencia(true);
    setEstadoEnvio("idle");
    setNombre("");
    setApellido("");
    setCantidad(1);
  };

  useEffect(() => {
    audioRef.current = new Audio(musicaFondo);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstadoEnvio("sending");

    try {
      const body = new URLSearchParams({
        nombre,
        apellido,
        cantidad: String(cantidad),
      });

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body,
      });

      setEstadoEnvio("success");
      setNombre("");
      setApellido("");
      setCantidad(1);
    } catch (error) {
      console.error(error);
      setEstadoEnvio("error");
    }
  };

  const handleToggleMusic = async () => {
    if (!audioRef.current) return;

    const START_AT = 30;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audioRef.current.readyState < 1) {
          await new Promise((resolve) => {
            const handler = () => {
              audioRef.current.removeEventListener(
                "loadedmetadata",
                handler
              );
              resolve();
            };
            audioRef.current.addEventListener("loadedmetadata", handler);
          });
        }

        audioRef.current.currentTime = START_AT;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("No se pudo reproducir el audio:", err);
      }
    }
  };

  return (
    <div
      className="min-h-screen text-slate-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgInvitation})` }}
    >
      {/* velo blanco para lectura */}
      <div className="min-h-screen bg-white/70">
        {/* HERO 1 */}
        <motion.section
          className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4 sm:px-8 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${seccion1})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="relative space-y-3"
              variants={textStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <TextMotion
                as="p"
                className="text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase"
              >
                XV Años
              </TextMotion>
              <TextMotion
                as="h1"
                className="text-3xl sm:text-4xl md:text-5xl font-semibold"
              >
                Adelina
              </TextMotion>
              <TextMotion className="text-sm sm:text-base md:text-lg">
                4 de Julio, 2026
                <br />
                21:30
              </TextMotion>

              <motion.button
                onClick={handleToggleMusic}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/80 hover:bg-black px-5 py-2 text-xs sm:text-sm font-medium"
                variants={textVariant}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>{isPlaying ? "⏸" : "▶"}</span>
                <span>
                  {isPlaying ? "Pausar música" : "Reproducir música"}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* COUNTDOWN */}
        <motion.section
          className={`${SECTION_BASE} flex justify-center`}
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="text-center space-y-4"
            variants={textStagger}
          >
            <TextMotion className="text-lg md:text-2xl">
              Días restantes:
            </TextMotion>

            <div className="flex justify-center gap-3 md:gap-4">
              {[
                { label: "Días", value: countdown.days },
                { label: "Horas", value: countdown.hours },
                { label: "Min", value: countdown.minutes },
                { label: "Seg", value: countdown.seconds },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col items-center"
                  variants={textVariant}
                >
                  <div className="min-w-[56px] md:min-w-[72px] px-4 py-3 md:px-5 md:py-4 bg-black text-white text-2xl md:text-4xl rounded">
                    <AnimatedNumber value={item.value} />
                  </div>
                  <span className="mt-2 text-xs md:text-sm uppercase tracking-wide">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* MENSAJE FOTO */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4 sm:px-8 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${seccion4})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="relative max-w-3xl mx-auto px-2 sm:px-4"
              variants={textStagger}
            >
              <TextMotion
                as="p"
                className="text-base sm:text-lg md:text-2xl italic leading-relaxed"
              >
                "Será una noche especial para mi y me encantaria que la
                disfrutes conmigo."
              </TextMotion>
              <TextMotion
                as="p"
                className="mt-4 text-sm md:text-base font-semibold"
              >
                - Adelina
              </TextMotion>
            </motion.div>
          </div>
        </motion.section>

        {/* UBICACIÓN */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="w-full max-w-xl sm:max-w-2xl text-center space-y-4 bg-white/80 rounded-2xl shadow-lg px-6 sm:px-8 py-8 sm:py-10"
            variants={textStagger}
          >
            <TextMotion as="div" className="text-2xl">
              📍
            </TextMotion>
            <TextMotion
              as="h2"
              className="text-lg md:text-xl font-medium"
            >
              Ubicación del evento:
            </TextMotion>
            <TextMotion className="text-base md:text-lg">
              Salon Las Rosas, Junin, Mendoza
            </TextMotion>
          </motion.div>
        </motion.section>

        {/* FOTO FULL seccion5 */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4 sm:px-8 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${seccion5})` }}
            variants={sectionVariant}
          />
        </motion.section>

        {/* DRESS CODE */}
        <motion.section
          className={`${SECTION_BASE} text-center space-y-3`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={textStagger}>
            <TextMotion
              as="div"
              className="text-3xl flex items-center justify-center gap-3"
            >
              <span role="img" aria-label="saco">
                🧥👗
              </span>
            </TextMotion>
            <TextMotion className="text-sm md:text-base">
              Código de vestimenta:
            </TextMotion>
            <TextMotion
              as="p"
              className="text-xl md:text-2xl font-semibold"
            >
              Formal
            </TextMotion>
            <TextMotion className="text-lg md:text-xl">
              Dress Code: No utilizar Rojo
            </TextMotion>
          </motion.div>
        </motion.section>

        {/* FOTO FULL imagen4 */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${imagen4})` }}
            variants={sectionVariant}
          />
        </motion.section>

        {/* VALOR TARJETA */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="w-full max-w-xl sm:max-w-2xl text-center space-y-4 bg-white/80 rounded-2xl shadow-lg px-6 sm:px-8 py-8 sm:py-10"
            variants={textStagger}
          >
            <motion.div
              className="mx-auto mb-2 w-16 h-16 rounded-2xl bg-[#6EC471] hover:bg-[#8ceb8f] px-8 cursor-pointer flex items-center flex-row justify-center shadow-md"
              animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-2xl">📝</span>
              <span className="text-2xl">💖</span>
            </motion.div>

            <TextMotion
              as="h2"
              className="text-lg md:text-xl font-medium tracking-[0.15em]"
            >
              VALOR DE LA TARJETA
            </TextMotion>

            <button
              onClick={() => setMostrarPrecio(true)}
              className="rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] text-white text-sm font-medium px-5 py-2"
            >
              VER VALOR
            </button>
          </motion.div>
        </motion.section>

        {/* MAPA */}
        <motion.section
          className={`${SECTION_BASE} space-y-10`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="space-y-4 text-center"
            variants={textStagger}
          >
            <TextMotion className="max-w-3xl mx-auto text-base md:text-lg">
              Salon Las Rosas, Junin, Mendoza - 21:30
            </TextMotion>

            <div className="max-w-4xl mx-auto w-full">
              <motion.div
                className="aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200"
                variants={sectionVariant}
              >
                <iframe
                  title="Mapa del evento"
                  src="https://www.google.com/maps?q=Salon%20Las%20Rosas%20Junin%20Mendoza&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>

              <motion.a
                href="https://maps.app.goo.gl/5XD1Esf1orj5Mv2h7?g_st=aw"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex justify-center"
                variants={textVariant}
              >
                <button className="rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] text-white text-sm font-medium px-5 py-2">
                  Abrir en Google Maps
                </button>
              </motion.a>
            </div>
          </motion.div>
        </motion.section>

        {/* FOTO APILADA */}
        <motion.section
          className={`${SECTION_BASE} flex flex-col items-center gap-10`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="w-full flex flex-col items-center">
            <PhotoStack />
          </div>
          <TextMotion
            as="p"
            className="text-xs md:text-sm text-slate-600 mt-4"
          >
            Toca para ver más fotos
          </TextMotion>
        </motion.section>

        {/* CONFIRMAR ASISTENCIA */}
        <motion.section
          className={`${SECTION_BASE} flex items-center justify-center`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="w-full max-w-xl sm:max-w-2xl text-center space-y-4 bg-white/80 rounded-2xl shadow-lg px-6 sm:px-8 py-8 sm:py-10"
            variants={textStagger}
          >
            <TextMotion
              as="h2"
              className="text-lg md:text-xl font-medium "
            >
              ¡Te esperamos!
            </TextMotion>

            <button
              onClick={handleOpenAsistencia}
              className="rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] text-white text-sm font-medium px-5 py-2"
            >
              CONFIRMAR ASISTENCIA
            </button>
          </motion.div>
        </motion.section>
      </div>

      {/* MODAL PRECIOS */}
      {mostrarPrecio && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-[90%] px-6 py-8 text-center space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Valores de la tarjeta
            </h2>
            <h3
              className="text-base sm:text-lg font-semibold text-slate-800 cursor-pointer select-none hover:text-[#6EC471] transition"
              onClick={() => {
                navigator.clipboard.writeText("ade.garro.694");
              }}
            >
              Alias: ade.garro.694
            </h3>

            <div className="space-y-3 text-sm sm:text-base text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Hasta el 28/02</span>
                <span className="font-semibold">$ 30.000</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Hasta el 30/04</span>
                <span className="font-semibold">$ 35.000</span>
              </div>
              <div className="flex justify-between">
                <span>Hasta el 20/06</span>
                <span className="font-semibold">$ 40.000</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-slate-500">
                * Menores de 10 años NO PAGAN.
              </p>

              <p className="text-xs sm:text-sm text-slate-500">
                * Enviar comprobante al{" "}
                <a
                  href="https://wa.me/542634180364"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6EC471] font-semibold hover:opacity-80"
                >
                  +54 2634 180364
                </a>
                .
              </p>
            </div>

            <button
              onClick={() => setMostrarPrecio(false)}
              className="rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] text-white text-sm font-medium px-5 py-2"
            >
              Volver
            </button>
          </motion.div>
        </div>
      )}

      {/* MODAL ASISTENCIA */}
      {mostrarAsistencia && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-[90%] px-6 py-8 space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-slate-800">
              Confirmar asistencia
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 text-left">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6EC471] focus:border-[#6EC471]"
                    placeholder="Nombre"
                  />
                </div>

                <div className="flex-1 text-left">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6EC471] focus:border-[#6EC471]"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                  Cantidad de personas
                </label>

                <select
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6EC471] focus:border-[#6EC471] bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
                  Incluyéndote a vos 🙂
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={estadoEnvio === "sending"}
                  className="flex-1 rounded-full bg-[#6EC471] hover:bg-[#8ceb8f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2"
                >
                  {estadoEnvio === "sending"
                    ? "Enviando..."
                    : "Enviar confirmación"}
                </button>

                <button
                  type="button"
                  onClick={() => setMostrarAsistencia(false)}
                  className="flex-1 rounded-full border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2 bg-slate-50 hover:bg-slate-100"
                >
                  Cancelar
                </button>
              </div>

              {estadoEnvio === "sending" && (
                <p className="text-xs sm:text-sm text-slate-500 text-center mt-2">
                  Enviando tu confirmación...
                </p>
              )}

              {estadoEnvio === "success" && (
                <p className="text-xs sm:text-sm text-green-600 text-center mt-2">
                  ¡Gracias por confirmar tu asistencia! 💖
                </p>
              )}

              {estadoEnvio === "error" && (
                <p className="text-xs sm:text-sm text-red-500 text-center mt-2">
                  Ocurrió un error al enviar. Por favor, intentá de nuevo.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// =================== CORTINA FLORAL (DESLIZA Y SE ABRE) ===================
function FloralCurtain({ onFinished }) {
  const [unlocked, setUnlocked] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);

  useEffect(() => {
    if (unlocked) {
      const t1 = setTimeout(() => setAnimateOpen(true), 50);
      const t2 = setTimeout(() => {
        onFinished();
      }, 1700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [unlocked, onFinished]);

  const handleUnlock = () => {
    if (!unlocked) setUnlocked(true);
  };

  const handleWheel = (e) => {
    if (e.deltaY > 0) handleUnlock();
  };

  if (!unlocked) {
    return (
      <div
        className="fixed inset-0 z-40"
        onWheel={handleWheel}
        onClick={handleUnlock}
        onTouchStart={handleUnlock}
      >
        <div
          className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bgFlowers})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <TextMotion
            as="p"
            className="relative text-lg md:text-2xl font-medium text-yellow-200 px-4 text-center"
          >
            Desliza para abrir
          </TextMotion>
        </div>
      </div>
    );
  }

  // Estado de apertura: la imagen se parte en dos mitades
  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      onWheel={handleWheel}
      onClick={handleUnlock}
      onTouchMove={handleUnlock}
    >
      {/* Mitad superior */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-cover bg-center transform transition-transform duration-[1500ms] ease-in-out ${animateOpen ? "-translate-y-full" : "translate-y-0"
          }`}
        style={{
          backgroundImage: `url(${bgFlowers})`,
          backgroundPosition: "center top",
        }}
      />
      {/* Mitad inferior */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-cover bg-center transform transition-transform duration-[1500ms] ease-in-out ${animateOpen ? "translate-y-full" : "translate-y-0"
          }`}
        style={{
          backgroundImage: `url(${bgFlowers})`,
          backgroundPosition: "center bottom",
        }}
      />
    </div>
  );
}

// =================== APP PRINCIPAL ===================
export default function App() {
  // 0 = IntroCard, 1 = FloralCurtain, 2 = Invitación visible
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Barra de progreso de scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#6EC471] origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* La invitación está siempre de fondo */}
      <QuinceInvitation />

      {/* Paso 1: card de bienvenida */}
      {step === 0 && (
        <div className="fixed inset-0 z-50">
          <IntroCard onEnter={() => setStep(1)} />
        </div>
      )}

      {/* Paso 2: pantalla floral que se abre en dos */}
      {step === 1 && <FloralCurtain onFinished={() => setStep(2)} />}
    </div>
  );
}
