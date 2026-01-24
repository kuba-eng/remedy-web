"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEAM_DATA } from "@/data/team";

export function Team() {
    const [activeMember, setActiveMember] = useState<number | null>(null);

    return (
        <Section id="tym" className="bg-secondary/30">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 uppercase"><span className="text-[#D9F99D]">REMEDY</span> TEAM</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Jsme tým zkušených odborníků, kteří se neustále vzdělávají, aby vám poskytli tu nejlepší péči.
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
                            {/* Placeholder for Team Member Image */}
                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                                <span className="text-xs">Photo</span>
                            </div>
                        </motion.div>

                        <motion.h3 layout className="text-xl font-bold text-primary">{member.name}</motion.h3>
                        <motion.p layout className="text-[#D9F99D] font-medium mb-3">{member.role}</motion.p>

                        <AnimatePresence>
                            {activeMember === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full"
                                >
                                    <p className="text-muted-foreground text-sm mt-2 pb-4 leading-relaxed">
                                        {member.bio}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
