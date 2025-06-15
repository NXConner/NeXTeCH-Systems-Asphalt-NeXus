import React from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useTheme } from '@/components/ThemeProvider';
import { Check, Monitor, Moon, Paintbrush, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { themes } from '@/themes/themeConfig';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themeGroups = Object.entries(themes).reduce((acc, [key, theme]) => {
    const category = theme.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ id: key, ...theme });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/10 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 bg-background/95 backdrop-blur-lg border border-border/10 shadow-2xl rounded-xl"
        align="end"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">Theme</h4>
            <Paintbrush className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="w-full justify-start gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
              {theme === 'light' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="w-full justify-start gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
              {theme === 'dark' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="w-full justify-start gap-2"
            >
              <Monitor className="h-4 w-4" />
              System
              {theme === 'system' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {Object.entries(themeGroups).map(([category, themes]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h5 className="text-sm font-medium text-muted-foreground">{category}</h5>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t) => (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={theme === t.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme(t.id)}
                        className="w-full h-auto aspect-square p-2 rounded-xl relative overflow-hidden group"
                        style={{
                          background: t.colors.light.background,
                          border: `1px solid ${t.colors.light.border}`
                        }}
                      >
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(45deg, ${t.colors.light.primary}, ${t.colors.light.secondary})`
                          }}
                        />
                        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                          <span 
                            className="text-xs font-medium truncate"
                            style={{ color: t.colors.light.foreground }}
                          >
                            {t.name}
                          </span>
                          {theme === t.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1"
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelector;