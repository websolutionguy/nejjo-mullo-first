import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, ChevronRight, X, Sprout } from "lucide-react";
import { locations } from "@/src/data/locations";
import { cn } from "@/src/types";

interface LocationPopupProps {
  onSelect: (location: { district: string; thana: string }) => void;
}

export default function LocationPopup({ onSelect }: LocationPopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const filteredDistricts = locations.filter((loc) =>
    loc.district.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // If there's an exact match for a district, we could show its thanas
  const exactMatch = locations.find(
    (loc) => loc.district.toLowerCase() === searchTerm.toLowerCase(),
  );

  const currentDistrict = selectedDistrict
    ? locations.find((loc) => loc.district === selectedDistrict)
    : exactMatch;

  const handleThanaSelect = (thana: string, district: string) => {
    onSelect({ district, thana });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-primary p-8 text-white relative">
              <div className="flex items-center space-x-3 mb-4">
                <Sprout className="h-8 w-8 text-primary-light" />
                <h2 className="text-3xl font-bold font-display">Nejjo Mullo</h2>
              </div>
              <h3 className="text-xl font-medium opacity-90">
                Choose your area first
              </h3>
              <p className="text-sm opacity-75 mt-2">
                To provide you with the best local investment opportunities and
                products, please select your location.
              </p>
            </div>

            {/* Content */}
            <div className="p-8 flex-grow overflow-hidden flex flex-col">
              {!selectedDistrict && !exactMatch ? (
                <>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search your district (e.g. Dhaka, Sylhet)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((loc) => (
                        <button
                          key={loc.district}
                          onClick={() => setSelectedDistrict(loc.district)}
                          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary-light border border-transparent hover:border-primary/10 transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-stone-100 text-stone-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-stone-700">
                              {loc.district}
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-primary transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12 text-stone-400">
                        <p>No districts found matching "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => {
                        setSelectedDistrict(null);
                        setSearchTerm("");
                      }}
                      className="text-primary font-bold flex items-center hover:underline"
                    >
                      <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
                      Back to Districts
                    </button>
                    <div className="px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {currentDistrict?.district}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-stone-800 mb-4">
                    Select your Thana in {currentDistrict?.district}
                  </h4>

                  <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar">
                    {currentDistrict?.thanas.map((thana) => (
                      <button
                        key={thana}
                        onClick={() =>
                          handleThanaSelect(thana, currentDistrict.district)
                        }
                        className="text-left p-4 rounded-2xl bg-stone-50 hover:bg-primary hover:text-white border border-stone-100 transition-all font-medium"
                      >
                        {thana}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400">
                Nejjo Mullo uses your location to show relevant projects in your
                region.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
