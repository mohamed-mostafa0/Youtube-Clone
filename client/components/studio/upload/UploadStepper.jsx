import { MdCheck } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadStepper({ currentStep }) {
  const steps = [
    { id: "details", label: "Details", description: "Video Info" },
    { id: "visibility", label: "Visibility", description: "Publish" }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#282828] border-b border-gray-100 dark:border-[#3f3f3f] pt-8 pb-16 px-8 relative overflow-visible z-10 shadow-sm">
      
      <div className="max-w-md mx-auto flex items-center justify-between relative h-5">
        
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 dark:bg-[#3f3f3f] rounded-full -translate-y-1/2" />
        
        <motion.div 
          className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full -translate-y-1/2 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep === 1 ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isPast = currentStep > index;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center justify-center">
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 w-12 h-12 rounded-full border-2 border-black-500/40"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors duration-500 shadow-md ${
                  isPast || isActive 
                    ? "bg-black text-white shadow-blue-500/30" 
                    : "bg-gray-100 dark:bg-[#3f3f3f] text-gray-400 shadow-transparent"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isPast ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
                    >
                      <MdCheck className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-base font-bold"
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="absolute top-13 flex flex-col items-center w-40 text-center"
                animate={{
                  y: isActive ? 0 : -4,
                  opacity: isActive || isPast ? 1 : 0.5
                }}
                transition={{ duration: 0.4 }}
              >
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-black-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {step.label}
                </span>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase mt-0.5 overflow-hidden"
                    >
                      {step.description}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
