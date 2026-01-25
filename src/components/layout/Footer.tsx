import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, MessageCircle, Clock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">

                {/* Contact Info Grid - Moved from Contact Section */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-7xl">
                    <ContactItem
                        icon={<MapPin className="w-7 h-7 text-black" />}
                        title="Adresa"
                        content="Doležalovo náměstí 73/2, 591 01 Žďár nad Sázavou"
                    />
                    <ContactItem
                        icon={<Clock className="w-7 h-7 text-black" />}
                        title="Otevírací doba"
                        content="Dle objednání (Po–Pá)"
                    />
                    <ContactItem
                        icon={<Phone className="w-7 h-7 text-black" />}
                        title="Telefon"
                        content={
                            <div className="flex flex-col gap-1">
                                <a href="tel:+420777868636" className="hover:text-black transition-colors">+420 777 868 636 (Kuba)</a>
                                <a href="tel:+420776274111" className="hover:text-black transition-colors">+420 776 274 111 (Radim)</a>
                            </div>
                        }
                    />
                    <ContactItem
                        icon={<Mail className="w-7 h-7 text-black" />}
                        title="Email"
                        content={
                            <div className="flex flex-col gap-1">
                                <a href="mailto:info@remedy.cz" className="hover:text-black transition-colors">info@remedy.cz</a>
                                <a href="mailto:kuba@remedy.cz" className="hover:text-black transition-colors">kuba@remedy.cz</a>
                                <a href="mailto:radim@remedy.cz" className="hover:text-black transition-colors">radim@remedy.cz</a>
                            </div>
                        }
                    />
                </div>

                {/* Logo */}
                <div className="mb-8">
                    <Link href="/" className="relative block h-10 w-40 group">
                        {/* Logo colored via mask to match social icons */}
                        <div
                            className="w-full h-full bg-black transition-colors duration-300 group-hover:bg-[#D9F99D]"
                            style={{
                                maskImage: 'url("/images/logo.png")',
                                WebkitMaskImage: 'url("/images/logo.png")',
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center'
                            }}
                        />
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex gap-6 mb-12">
                    <a href="https://www.facebook.com/remedymedicalfitness" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D9F99D] transition-colors hover:scale-110 transition-transform">
                        <Facebook className="w-6 h-6" />
                    </a>
                    <a href="https://www.instagram.com/remedy_medical_fitness/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D9F99D] transition-colors hover:scale-110 transition-transform">
                        <Instagram className="w-6 h-6" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-xs text-primary-foreground/40 font-light tracking-wider">
                    Remedy medical fitness &copy; {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    );
}

function ContactItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4 group text-left">
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1 opacity-80">{title}</h3>
                <div className="text-neutral-600 font-medium leading-relaxed group-hover:text-black transition-colors text-sm">
                    {content}
                </div>
            </div>
        </div>
    );
}
