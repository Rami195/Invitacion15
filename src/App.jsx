import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import bgFlowers from "../public/imagen2.jpeg"; // usa tu imagen floral
import bgInvitation from "../public/imagen3.jpeg";
import seccion1 from "../public/seccion1.jpeg";
import seccion2 from "../public/seccion2.jpeg";
import seccion3 from "../public/seccion3.jpeg";
import seccion4 from "../public/seccion4.jpeg";
import musicaFondo from "../public/Hola.mp3";

// =================== CONFIG FECHA ===================
const EVENT_DATE = new Date("2026-07-04T21:30:00");
const stackImages = [seccion1, seccion2, seccion3, seccion4];

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

// =================== CLASE BASE PARA SECCIONES ===================
const SECTION_BASE =
  "py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8";

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
            className="mt-2 w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2.5 transition"
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
    <div
      className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl aspect-[4/3] mx-auto cursor-pointer select-none"
      onClick={handleNext}
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
    </div>
  );
}

// =================== INVITACIÓN PRINCIPAL ===================
function QuinceInvitation() {
  const countdown = useCountdown(EVENT_DATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(musicaFondo);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleToggleMusic = async () => {
    if (!audioRef.current) return;

    const START_AT = 30; // segundo donde querés que empiece

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
        {/* HERO 1 (lo dejamos con min-h específico) */}
        <section className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
        </section>

        {/* UBICACIÓN */}
        <section className={`${SECTION_BASE} flex justify-center`}>
          <motion.div
            className="w-full max-w-xl sm:max-w-2xl text-center space-y-4 bg-white/80 rounded-2xl shadow-lg px-6 sm:px-8 py-8 sm:py-10"
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
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
        </section>

        {/* MENSAJE FOTO */}
        <section className={`${SECTION_BASE} flex items-center justify-center`}>
          <div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4 sm:px-8 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${seccion2})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="relative max-w-3xl mx-auto px-2 sm:px-4"
              variants={textStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <TextMotion
                as="p"
                className="text-base sm:text-lg md:text-2xl italic leading-relaxed"
              >
                "Con mucha ilusión, te invito a mis quince primaveras, un día
                lleno de sueños y alegría que quiero compartir contigo."
              </TextMotion>
              <TextMotion
                as="p"
                className="mt-4 text-sm md:text-base font-semibold"
              >
                - Adelina
              </TextMotion>
            </motion.div>
          </div>
        </section>

        {/* FOTO FULL */}
        <section className={`${SECTION_BASE} flex items-center justify-center`}>
          <div
            className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${seccion3})` }}
          />
        </section>

        {/* DRESS CODE */}
        <section className={`${SECTION_BASE} text-center space-y-3`}>
          <motion.div
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
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
              Dress Code: Negro y blanco
            </TextMotion>
          </motion.div>
        </section>

        {/* CONTADOR + MAPA */}
        <section className={`${SECTION_BASE} space-y-10`}>
          {/* Contador */}
          <motion.div
            className="text-center space-y-4"
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <TextMotion className="text-sm md:text-base">
              Días restantes:
            </TextMotion>
            <div className="flex justify-center gap-2 md:gap-3">
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
                  <div className="min-w-[42px] md:min-w-[56px] px-3 py-2 md:px-4 md:py-3 bg-black text-white text-lg md:text-2xl font-mono rounded">
                    {item.value}
                  </div>
                  <span className="mt-1 text-[10px] md:text-xs uppercase tracking-wide">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Texto + Mapa */}
          <motion.div
            className="space-y-4 text-center"
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <TextMotion className="max-w-3xl mx-auto text-base md:text-lg">
              Salon Las Rosas, Junin, Mendoza - 21:30
            </TextMotion>

            <div className="max-w-4xl mx-auto w-full">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <iframe
                  title="Mapa del evento"
                  src="https://www.google.com/maps?q=Salon%20Las%20Rosas%20Junin%20Mendoza&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <motion.a
                href="https://maps.app.goo.gl/5XD1Esf1orj5Mv2h7?g_st=aw"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex justify-center"
                variants={textVariant}
              >
                <button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-5 py-2">
                  Abrir en Google Maps
                </button>
              </motion.a>
            </div>
          </motion.div>

        </section>

        {/* ITINERARIO + FOTO APILADA */}
        <section
          className={`${SECTION_BASE} flex flex-col items-center gap-10`}
        >
          {/* Itinerario */}
          <motion.div
            className="w-full max-w-sm sm:max-w-md text-center"
            variants={textStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <TextMotion
              as="h2"
              className="text-lg md:text-xl font-semibold mb-6"
            >
              Itinerario
            </TextMotion>

            <div className="inline-block text-left relative pl-4 sm:pl-6">
              {/* línea vertical */}
              <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-slate-400" />

              <div className="space-y-6 text-xs sm:text-sm md:text-base">
                {/* Evento 1 */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={textVariant}
                >
                  <span className="text-[11px] sm:text-xs md:text-sm font-mono w-12 text-right">
                    21:30
                  </span>
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📅</span>
                    <p className="text-sm md:text-base">Recepción</p>
                  </div>
                </motion.div>

                {/* Evento 2 */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={textVariant}
                >
                  <span className="text-[11px] sm:text-xs md:text-sm font-mono w-12 text-right">
                    22:30
                  </span>
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎉</span>
                    <div className="text-sm md:text-base leading-tight">
                      <p>Entrada</p>
                      <p>Quinceañera</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Foto estilo “polaroid” apilada */}
          <div className="w-full flex flex-col items-center">
            <PhotoStack />

          </div>
          <TextMotion
            as="p"
            className="text-xs md:text-sm text-slate-600 mt-4"
          >
            Toca para ver más fotos
          </TextMotion>
        </section>

        {/* CIERRE */}
        <section className={`${SECTION_BASE} text-center`}>
          <TextMotion
            as="p"
            className="text-lg sm:text-xl md:text-2xl font-semibold"
          >
            ¡Te esperamos!
          </TextMotion>
        </section>
      </div>
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

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
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
