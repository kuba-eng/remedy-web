"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEAM_DATA } from "@/data/team";
import Image from "next/image";

export function Team() {
    const [activeMember, setActiveMember] = useState<number | null>(null);

    return (
        <Section id="tym" className="bg-secondary/30">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 uppercase tracking-tight"><span className="text-[#D9F99D]">REMEDY</span> TEAM</h2>
                <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
                    Jsme tým zkušených odborníků, kteří se neustále vzdělávají, aby vám poskytli tu nejlepší&nbsp;péči.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                {TEAM_DATA.map((member, index) => (
                    <motion.div
                        layout
                        key={index}
                        onClick={() => setActiveMember(activeMember === index ? null : index)}
                        className={cn(
                            "flex flex-col items-center text-center group cursor-pointer p-4 rounded-3xl transition-colors duration-300",
                            activeMember === index ? "bg-white/5" : "hover:bg-white/5"
                        )}
                    >
                        <motion.div
                            layout
                            className={cn(
                                "rounded-full overflow-hidden mb-6 border-4 shadow-lg transition-colors duration-300 bg-muted relative",
                                activeMember === index ? "w-32 h-32 border-[#D9F99D]" : "w-48 h-48 border-white group-hover:border-[#D9F99D]/50"
                            )}
                        >
                            {member.image ? (
                                <div 
                                    className="w-full h-full relative transition-transform duration-300"
                                    style={{ transform: member.imageTransform || "none" }}
                                >
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                        style={{ objectPosition: member.imagePosition || "center 30%" }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-neutral-200/20 flex items-center justify-center text-neutral-400">
                                    <span className="text-xs">Ubránit</span>
                                </div>
                            )}
                        </motion.div>

                        <motion.h3 layout className="text-xl font-bold text-primary">{member.name}</motion.h3>
                        <motion.p layout className="text-[#D9F99D] font-medium mb-3">{member.role}</motion.p>

                        <AnimatePresence>
                            {activeMember === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full flex flex-col items-center"
                                >
                                    <p className="text-muted-foreground text-sm mt-2 pb-4 leading-relaxed whitespace-pre-line">
                                        {member.bio}
                                    </p>
                                    
                                    {member.reservationLink && (
                                        <a 
                                            href={member.reservationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 mb-4 bg-[#D9F99D] text-black hover:bg-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(217,249,157,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                        >
                                            Objednat se
                                        </a>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
