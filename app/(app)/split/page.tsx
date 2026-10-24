"use client";

import React, { useState } from "react";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { BentoCard } from "@/components/ui/BentoCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { formatCurrency } from "@/lib/format";
import {
  Users,
  Plus,
  Share2,
  CheckCircle,
  Clock,
  MessageCircle,
  ShieldCheck,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface SplitParticipant {
  id: string;
  name: string;
  phoneOrUpi: string;
  sharePercent: number;
  paid: boolean;
}

export default function SmartSplitPage() {
  const { subscriptions } = useSubscriptions();

  // Pick Netflix as default split subscription if available
  const defaultSub =
    subscriptions.find((s) => s.service_name.toLowerCase().includes("netflix")) ||
    subscriptions[0];

  const [selectedSubId, setSelectedSubId] = useState<string>(
    defaultSub ? defaultSub.id : ""
  );

  // Preloaded roommates / friends for Arjun
  const [participants, setParticipants] = useState<SplitParticipant[]>([
    {
      id: "p1",
      name: "Rohan Sharma",
      phoneOrUpi: "rohan@okhdfcbank",
      sharePercent: 25,
      paid: true,
    },
    {
      id: "p2",
      name: "Priya Verma",
      phoneOrUpi: "priya@paytm",
      sharePercent: 25,
      paid: false,
    },
    {
      id: "p3",
      name: "Kabir Mehta",
      phoneOrUpi: "kabir@oksbi",
      sharePercent: 25,
      paid: false,
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newUpi, setNewUpi] = useState("");

  const activeSub = subscriptions.find((s) => s.id === selectedSubId);
  const totalCost = activeSub ? activeSub.cost : 0;

  // Arjun's share is remaining percentage
  const totalSplitPercent = participants.reduce((acc, p) => acc + p.sharePercent, 0);
  const arjunPercent = Math.max(0, 100 - totalSplitPercent);
  const arjunCost = (totalCost * arjunPercent) / 100;
  const totalRecovered = (totalCost * totalSplitPercent) / 100;

  const togglePaid = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, paid: !p.paid } : p))
    );
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const count = participants.length + 2; // +1 new, +1 arjun
    const equalShare = Math.floor(100 / count);

    const newParticipant: SplitParticipant = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      phoneOrUpi: newUpi.trim() || "friend@upi",
      sharePercent: equalShare,
      paid: false,
    };

    setParticipants([...participants, newParticipant]);
    setNewName("");
    setNewUpi("");
    toast.success(`Added ${newParticipant.name} to the split!`);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    toast.info("Removed participant from split.");
  };

  const copyWhatsAppReminder = (p: SplitParticipant) => {
    if (!activeSub) return;
    const shareAmount = ((activeSub.cost * p.sharePercent) / 100).toFixed(0);
    const message = `Hey ${p.name}! Your share of ₹${shareAmount} for our ${activeSub.service_name} subscription is due. Pay Arjun via UPI: arjun@okaxis. Cheers!`;
    navigator.clipboard.writeText(message);
    toast.success(`Copied reminder for ${p.name}! Paste into WhatsApp.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-text-primary">
              Smart Split
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Split premium subscriptions with friends and roommates, track who paid, and slash your net burn.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Saves you {formatCurrency(totalRecovered)}/cycle</span>
        </div>
      </div>

      {/* Select Subscription Strip */}
      <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase">
            Split Target:
          </span>
          <select
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
            aria-label="Select subscription to split"
            className="bg-surface-base border border-border-subtle rounded-xl px-3 py-2 text-sm text-text-primary font-semibold focus:outline-none focus:border-violet-500"
          >
            {subscriptions.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#12131A] text-white">
                {s.service_name} — {formatCurrency(s.cost)}/{s.billing_cycle}
              </option>
            ))}
          </select>
        </div>

        {activeSub && (
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-text-muted block">Gross Plan Cost</span>
              <span className="font-bold text-text-primary font-mono text-sm">
                {formatCurrency(activeSub.cost)}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted hidden sm:block" />
            <div>
              <span className="text-text-muted block">Your Net Share</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {formatCurrency(arjunCost)} ({arjunPercent}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Split Details Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Participants List (2 cols) */}
        <BentoCard colSpan={2} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              Co-Subscribers ({participants.length + 1} People)
            </h2>
            <span className="text-xs text-text-muted">
              Equal split: ~{((100 / (participants.length + 1))).toFixed(0)}% per person
            </span>
          </div>

          <div className="space-y-3">
            {/* Arjun (Host) Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-violet-600/10 border border-violet-500/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-black text-white">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Arjun (You)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-500/30 text-violet-300">
                      HOST
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted">Owner of account</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-xs text-white">
                  {formatCurrency(arjunCost)}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  Primary Payer
                </span>
              </div>
            </div>

            {/* Friend Rows */}
            {participants.map((p) => {
              const friendAmount = (totalCost * p.sharePercent) / 100;

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface-base border border-border-subtle hover:border-border-subtle/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-text-primary">
                      {p.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-text-primary">
                        {p.name}
                      </div>
                      <span className="text-[11px] text-text-muted font-mono">
                        {p.phoneOrUpi}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-text-primary block">
                        {formatCurrency(friendAmount)}
                      </span>
                      <button
                        onClick={() => togglePaid(p.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 transition-colors ${
                          p.paid
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                        }`}
                      >
                        {p.paid ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Mark Paid
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => copyWhatsAppReminder(p)}
                      title="Copy WhatsApp Payment Reminder"
                      className="p-2 rounded-lg bg-surface-hover hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleRemoveParticipant(p.id)}
                      title="Remove participant"
                      className="text-xs text-rose-400 hover:text-rose-300 px-1"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Friend Form */}
          <form onSubmit={handleAddParticipant} className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="text"
              placeholder="Friend's name (e.g. Rahul)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-surface-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500"
            />
            <input
              type="text"
              placeholder="UPI ID or Phone (e.g. rahul@upi)"
              value={newUpi}
              onChange={(e) => setNewUpi(e.target.value)}
              className="flex-1 bg-surface-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500"
            />
            <GradientButton type="submit" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </GradientButton>
          </form>
        </BentoCard>

        {/* Right: Split Summary & UPI Collection (1 col) */}
        <BentoCard colSpan={1} className="p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-violet-400" />
              <h2 className="text-base font-bold text-text-primary">Split Intelligence</h2>
            </div>

            <div className="p-4 rounded-xl bg-surface-base border border-border-subtle space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Total Monthly Plan:</span>
                <span className="font-bold text-text-primary font-mono">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Recovered from Friends:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  +{formatCurrency(totalRecovered)}
                </span>
              </div>
              <div className="border-t border-border-subtle pt-2 flex justify-between text-xs">
                <span className="font-bold text-text-primary">Arjun&apos;s True Bleed:</span>
                <span className="font-black text-violet-400 font-mono text-sm">
                  {formatCurrency(arjunCost)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <p className="font-bold">Annual Savings Realized:</p>
              <p className="text-[11px] text-text-secondary">
                By splitting this subscription across {participants.length + 1} users, you save{" "}
                <strong className="text-white font-mono">
                  {formatCurrency(totalRecovered * 12)}/year
                </strong>.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={() => {
                const unpaid = participants.filter((p) => !p.paid);
                if (unpaid.length === 0) {
                  toast.success("All friends have paid their share! Zero pending debts.");
                  return;
                }
                toast.info(`Sent reminder batch to ${unpaid.length} pending co-subscribers.`);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Broadcast WhatsApp Reminders
            </button>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
