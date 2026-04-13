"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Interview } from "@/lib/interviews";

interface Props {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InterviewDetailModal({
  interview,
  isOpen,
  onClose,
}: Props) {
  if (!interview) return null;
  const bgColor = `#${interview.color.toString(16).padStart(6, "0")}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full sm:translate-y-4 sm:opacity-0"
              enterTo="translate-y-0 sm:opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 sm:opacity-100"
              leaveTo="translate-y-full sm:translate-y-4 sm:opacity-0"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-xl transition-all">
                {/* Handle bar for mobile */}
                <div className="flex justify-center pt-3 sm:hidden">
                  <div className="w-10 h-1 bg-light-gray rounded-full" />
                </div>

                {/* Header with gradient */}
                <div
                  className="h-32 flex items-center justify-center text-6xl"
                  style={{
                    background: `linear-gradient(135deg, ${bgColor}14 0%, ${bgColor}05 100%)`,
                  }}
                >
                  {interview.emoji}
                </div>

                <div className="p-5 sm:p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag label={interview.category} color={bgColor} />
                    <Tag label={interview.level} color="#1e3a8a" />
                    <Tag label="FREE" color="#10b981" />
                  </div>

                  <Dialog.Title className="text-2xl sm:text-3xl font-extrabold text-text-dark tracking-tight">
                    {interview.title}
                  </Dialog.Title>
                  <p className="mt-2 text-text-muted">
                    {interview.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <MetaChip icon="⏱️" label={interview.duration} />
                    <MetaChip
                      icon="👥"
                      label={`${(interview.participantCount / 1000).toFixed(0)}k participants`}
                    />
                    <MetaChip
                      icon="📋"
                      label={`${interview.topics.length} topics`}
                    />
                  </div>

                  <hr className="my-5 border-light-gray" />

                  <h4 className="font-bold text-text-dark mb-3">
                    What You'll Practice
                  </h4>
                  <ul className="space-y-2">
                    {interview.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2">
                        <span className="text-success mt-0.5">✓</span>
                        <span className="text-text-muted text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link
                      href={`/interview/${interview.slug}`}
                      className="block w-full bg-rich-blue text-white text-center font-semibold py-3 rounded-lg hover:bg-blue-800 transition"
                    >
                      Start Mock Interview →
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="px-3 py-1 text-xs font-bold rounded-full border"
      style={{
        backgroundColor: `${color}1a`,
        color: color,
        borderColor: `${color}33`,
      }}
    >
      {label}
    </span>
  );
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-soft-gray border border-light-gray rounded-lg px-3 py-1.5 text-xs text-text-muted">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
