// Landing page for Fleet Asphalt Nexus
// Requires: react-router-dom, shadcn/ui
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UnifiedMapInterface } from '@/components';
import ThemeSelector from '@/components/ui/theme-selector';
import { motion } from 'framer-motion';

const features = [
  'Real-time Fleet Tracking',
  'Smart Job Scheduling',
  'Automated Estimates',
  'Quality Control',
  'Weather Integration',
  'Team Management'
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      {/* MAP SECTION */}
      <div className="fixed top-0 left-0 w-full h-[70vh] min-h-[600px]" style={{margin: 0, padding: 0, zIndex: 1}}>
        <UnifiedMapInterface width="100%" height="100%" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      </div>

      {/* HEADER */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full py-6 px-8 flex justify-between items-center bg-background/80 backdrop-blur-lg shadow-lg z-10 mt-[70vh] border-b border-border/10"
      >
        <div className="text-2xl font-bold text-primary tracking-tight">
          Asphalt-NexTech_Systems
        </div>
        <div className="flex items-center gap-4">
          <ThemeSelector />
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground mb-6"
          >
            Asphalt Business Management, Reimagined
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-8"
          >
            All-in-one platform for CRM, estimates, fleet, jobs, analytics, and more. 
            Built for modern paving and asphalt companies.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/10"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </motion.div>
        </motion.section>

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border border-border/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-xl font-semibold text-primary mb-2">{feature}</div>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* FOOTER */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full py-4 text-center text-muted-foreground text-sm bg-background/70 backdrop-blur-lg border-t border-border/10 mt-auto"
      >
        © {new Date().getFullYear()} Asphalt-NexTech_Systems. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default Landing;