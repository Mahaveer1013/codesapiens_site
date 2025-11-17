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

  const scannerRef = useRef(null); // Html5Qrcode instance
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState(null); // { name: string, status: "success" | "already" | "error" }
  const [meetupTitle, setMeetupTitle] = useState("");

  /* ---------- Fetch Meetup Title ---------- */
  useEffect(() => {
    const fetchMeetup = async () => {
      const { data, error } = await supabase
        .from("meetups")
        .select("title")
        .eq("id", meetupId)
        .single();

      if (error) {
        toast.error("Failed to load meetup");
        console.error(error);
      } else {
        setMeetupTitle(data.title);
      }
    };

    fetchMeetup();
  }, [meetupId]);

  /* ---------- Start Scanner ---------- */
  const startScanner = async () => {
    try {
      setScanning(true);
      setFeedback(null);

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          await handleScan(decodedText);
        },
        (error) => {
          // Ignore scan errors (optional: log for debugging)
          // console.warn("Scan error:", error);
        }
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
      toast.error("Camera access denied or not available");
      setScanning(false);
    }
  };

  /* ---------- Handle QR Code Scan ---------- */
  const handleScan = async (userId) => {
    if (!userId) return;

    try {
      // Stop scanning temporarily
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }

      // Check if already scanned
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("meetup_id", meetupId)
        .eq("user_id", userId)
        .single();

      if (existing) {
        setFeedback({ name: "Already Scanned", status: "already" });
        toast("Already scanned!", { icon: "Warning" });
      } else {
        // Fetch user name
        const { data: user } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();

        const name = user?.full_name || "Unknown User";

        // Insert attendance
        const { error } = await supabase
          .from("attendance")
          .insert({
            meetup_id: meetupId,
            user_id: userId,
            scanned_at: new Date().toISOString(),
          });

        if (error) {
          setFeedback({ name, status: "error" });
          toast.error("Failed to mark attendance");
        } else {
          setFeedback({ name, status: "success" });
          toast.success(`${name} checked in!`);
        }
      }

      // Restart scanner after 2 seconds
      setTimeout(() => {
        if (scannerRef.current) {
          scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            async (text) => {
              await handleScan(text);
            },
            () => {}
          );
        }
      }, 2000);
    } catch (err) {
      console.error("Scan handling error:", err);
      toast.error("Something went wrong");
      setFeedback({ name: "Error", status: "error" });
    }
  };

  /* ---------- Stop Scanner on Unmount ---------- */
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">QR Scanner</h1>
              <p className="text-sm text-gray-600">{meetupTitle || "Loading..."}</p>
            </div>
          </div>

          {/* Scanner Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="relative">
              <div
                id="qr-reader"
                className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100"
              />
              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <QrCode className="w-16 h-16 text-white mb-4" />
                  <button
                    onClick={startScanner}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-xl text-center font-medium transition-all ${
                feedback.status === "success"
                  ? "bg-green-100 text-green-800"
                  : feedback.status === "already"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {feedback.status === "success" && (
                <span>{feedback.name} checked in successfully!</span>
              )}
              {feedback.status === "already" && (
                <span>{feedback.name} already scanned</span>
              )}
              {feedback.status === "error" && (
                <span>Failed to scan {feedback.name}</span>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">How to scan:</p>
            <ul className="space-y-1">
              <li>• Point camera at QR code</li>
              <li>• Hold steady until scanned</li>
              <li>• Feedback appears below</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}