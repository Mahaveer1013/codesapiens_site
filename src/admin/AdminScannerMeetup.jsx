// src/pages/AdminScannerMeetup.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, QrCode, Loader2 } from "lucide-react";

export default function AdminScannerMeetup() {
  const { meetupId } = useParams();
  const navigate = useNavigate();

  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [meetup, setMeetup] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // ---------- Beep ----------
  const beep = (success) => {
    const audio = new Audio(
      success
        ? "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
        : "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
    );
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // ---------- Fetch meetup title ----------
  useEffect(() => {
    const fetchMeetup = async () => {
      const { data, error } = await supabase
        .from("meetup")
        .select("title")
        .eq("id", meetupId)
        .single();

      if (error) {
        toast.error("Meetup not found");
        navigate("/admin/meetups");
      } else {
        setMeetup(data);
      }
    };
    fetchMeetup();
  }, [meetupId, navigate]);

  // ---------- Scanner ----------
  useEffect(() => {
    let qrCode = null;

    const start = async () => {
      if (initialized || !meetupId) return;

      qrCode = new Html5Qrcode("reader");
      scannerRef.current = qrCode;

      const config = { fps: 15, qrbox: { width: 280, height: 280 }, aspectRatio: 1 };

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras?.length) throw new Error("No camera");

        await qrCode.start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            if (!scanning) return;
            await qrCode.stop();
            setScanning(false);
            beep(true);

            try {
              const { data, error } = await supabase
                .from("registrations")
                .select("user_name, is_checked_in")
                .eq("token", decodedText.trim())
                .eq("meetup_id", meetupId)
                .single();

              if (error || !data) throw new Error("Invalid QR");

              if (data.is_checked_in) {
                setLastResult({ name: data.user_name, status: "already" });
                toast.error(`${data.user_name} already checked in`);
                beep(false);
              } else {
                const { error: upd } = await supabase
                  .from("registrations")
                  .update({
                    is_checked_in: true,
                    checked_in_at: new Date().toISOString(),
                  })
                  .eq("token", decodedText.trim());

                if (upd) throw upd;

                setLastResult({ name: data.user_name, status: "success" });
                toast.success(`${data.user_name} checked in!`);
              }
            } catch (e) {
              beep(false);
              setLastResult({ name: e.message || "Invalid QR", status: "error" });
              toast.error(e.message || "Invalid QR");
            }

            // restart after short pause
            setTimeout(() => {
              setLastResult(null);
              start();
            }, 2500);
          },
          () => {}
        );

        setScanning(true);
        setInitialized(true);
      } catch (e) {
        toast.error("Camera access denied or not available");
      }
    };

    start();

    return () => {
      if (qrCode && scanning) {
        qrCode.stop().catch(() => {});
        setScanning(false);
      }
    };
  }, [meetupId, initialized]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <QrCode className="w-6 h-6" />
              <span>QR Scanner</span>
            </h1>
            <div className="w-16" />
          </div>
          {meetup && <p className="text-center mt-2 text-lg">{meetup.title}</p>}
        </div>

        {/* Feedback */}
        {lastResult && (
          <div
            className={`p-8 text-center text-4xl font-bold transition-all ${
              lastResult.status === "success"
                ? "bg-green-600"
                : lastResult.status === "already"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          >
            {lastResult.status === "success" && "Checked In"}
            {lastResult.status === "already" && "Already Checked In"}
            {lastResult.status === "error" && "Failed"}
            <p className="text-2xl mt-3 opacity-90">{lastResult.name}</p>
          </div>
        )}

        {/* Scanner */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative">
            <div id="reader" className="rounded-2xl overflow-hidden shadow-2xl w-80 h-80" />
            {!scanning && !lastResult && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <Loader2 className="w-12 h-12 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 border-4 border-white/30 rounded-3xl relative">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-cyan-400 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-cyan-400 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-cyan-400 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-cyan-400 rounded-br-3xl" />
                <div className="scan-line" />
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes scan {
              0%   { transform: translateY(-300px); opacity:0; }
              50%  { opacity:1; }
              100% { transform: translateY(300px); opacity:0; }
            }
            .scan-line {
              position:absolute; left:0; right:0; height:3px;
              background:linear-gradient(90deg,transparent,#06b6d4,transparent);
              animation:scan 2.5s linear infinite;
              box-shadow:0 0 10px #06b6d4;
            }
          `}
        </style>
      </div>
    </>
  );
}