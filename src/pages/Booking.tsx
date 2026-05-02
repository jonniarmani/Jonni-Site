import { motion } from "motion/react";
import { BRAND, SEO } from "../config";
import SEOComp from "../components/SEO";
import { Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useMemo } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isBefore,
  startOfToday,
  isWeekend
} from "date-fns";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function Booking() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Video Production",
    message: ""
  });

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDateClick = (day: Date) => {
    if (isBefore(day, startOfToday())) return;
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const dateStr = format(selectedDate, "MMMM do, yyyy");
    const mailToLink = `mailto:${BRAND.contact.email}?subject=Booking Request: ${formData.service}&body=
Booking Request for Jonni Armani Media

Client Name: ${formData.name}
Email: ${formData.email}
Requested Date: ${dateStr}
Requested Time: ${selectedTime}
Service: ${formData.service}

Project Overview:
${formData.message}

---
Sent via Jonni Armani Media Web Booking`.trim();

    window.location.href = encodeURI(mailToLink);
    setIsSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 sm:pb-40">
      <SEOComp title={`Book a Session | ${BRAND.name}`} description="Schedule your cinematic production or photography session directly with Jonni Armani." />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-16 sm:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand-cyan uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
          >
            Direct Access
          </motion.span>
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
              Request A <span className="italic font-light">Session.</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg sm:text-xl font-light max-w-xl">
            Select a preferred date and time to secure your slot. All requests are manually reviewed for compatibility and travel logistics.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-100 p-16 text-center space-y-8 max-w-2xl mx-auto shadow-xl"
          >
            <div className="w-20 h-20 bg-brand-black text-brand-cyan flex items-center justify-center mx-auto rounded-full">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Email Drafted</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Your booking request has been drafted in your email client. Please review and send it to finalize the request.
            </p>
            <div className="pt-8">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-brand-black font-bold uppercase tracking-widest text-xs border-b-2 border-brand-cyan pb-1"
              >
                Draft Another Request
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Calendar Selection */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-12">
              <div className="bg-white text-brand-black p-8 sm:p-12 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-xl font-display font-bold uppercase flex items-center tracking-tight">
                    <CalendarIcon size={18} className="mr-3 text-brand-cyan" />
                    {format(currentMonth, "MMMM yyyy")}
                  </h2>
                  <div className="flex space-x-4">
                    <button onClick={prevMonth} className="hover:text-brand-cyan transition-colors p-2 border border-gray-100">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="hover:text-brand-cyan transition-colors p-2 border border-gray-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-[10px] uppercase tracking-widest font-black text-gray-400 py-4">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarDays.map((day, idx) => {
                    const isOutside = !isSameMonth(day, currentMonth);
                    const isPast = isBefore(day, startOfToday());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <button
                        key={idx}
                        disabled={isPast}
                        onClick={() => handleDateClick(day)}
                        className={`aspect-square sm:aspect-video flex flex-col items-center justify-center text-sm transition-all relative group
                          ${isOutside ? "opacity-20" : "opacity-100"}
                          ${isPast ? "cursor-not-allowed text-gray-300 bg-transparent" : "cursor-pointer hover:bg-brand-cyan/10"}
                          ${isSelected ? "text-white font-bold border-none" : "border border-gray-50"}
                          ${!isPast && !isSelected ? "text-brand-black" : ""}
                        `}
                      >
                        <span className="relative z-10">{format(day, "d")}</span>
                        {isSelected && (
                          <motion.div layoutId="activeDate" className="absolute inset-0 bg-brand-cyan z-0 shadow-lg shadow-brand-cyan/20" />
                        )}
                        {!isPast && !isSelected && isSameDay(day, new Date()) && (
                           <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 p-8 sm:p-12 space-y-12"
                >
                  <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 pb-4">
                    <Clock size={16} className="text-brand-cyan" />
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Select Preferred Time</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 px-6 text-xs font-bold transition-all border-2 ${
                          selectedTime === time 
                          ? "bg-brand-cyan text-white border-brand-cyan shadow-lg shadow-brand-cyan/20" 
                          : "border-gray-100 text-gray-500 hover:border-brand-cyan hover:text-brand-cyan"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Side */}
            <div className="lg:col-span-12 xl:col-span-5">
              <div className="sticky top-32 space-y-12">
                <div className="bg-white border border-gray-100 p-8 sm:p-12 border-l-4 border-brand-cyan shadow-xl">
                  <h3 className="text-lg font-display font-medium uppercase mb-4 tracking-tight">Booking Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Date</span>
                      <span className="font-bold">{selectedDate ? format(selectedDate, "MMMM do, yyyy") : "No date selected"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Time</span>
                      <span className="font-bold">{selectedTime || "No time selected"}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Your Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white px-6 py-4 outline-none border-2 border-gray-100 focus:border-brand-cyan transition-all font-medium"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-white px-6 py-4 outline-none border-2 border-gray-100 focus:border-brand-cyan transition-all font-medium"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Service Required</label>
                    <select 
                      className="w-full bg-white px-6 py-4 outline-none border-2 border-gray-100 focus:border-brand-cyan transition-all font-medium appearance-none"
                      value={formData.service}
                      onChange={e => setFormData({...formData, service: e.target.value})}
                    >
                      <option>Video Production</option>
                      <option>Commercial Brand Stories</option>
                      <option>Elite Sports Media</option>
                      <option>Photography Session</option>
                      <option>Creative Consulting</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Project Short Brief</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white px-6 py-4 outline-none border-2 border-gray-100 focus:border-brand-cyan transition-all font-medium resize-none"
                      placeholder="Objectives and vision..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-brand-black text-white py-6 font-bold uppercase tracking-[0.4em] text-xs hover:bg-brand-cyan transition-all disabled:opacity-30 flex items-center justify-center group"
                  >
                    Draft Booking Request <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                    Manual review required. No payment taken at this stage.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
