import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { NavigationService } from '../services/navigationService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Palette } from 'lucide-react';
import { ThemeIntegration } from './ui/theme-integration';
import { Badge } from './ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import UserMenu from './UserMenu';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

const navSections = NavigationService.getMainNavigation();
const quickActions = NavigationService.getQuickActions();

const Navigation = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState(() => navSections.map(() => true));
  const [showTheme, setShowTheme] = useState(false);
  const [sidebarBgClass, setSidebarBgClass] = useState('bg-gradient-primary');
  const [searchTerm, setSearchTerm] = useState('');
  const [miniMode, setMiniMode] = useState(() => localStorage.getItem('sidebarMiniMode') === 'true');
  const [sectionOrder, setSectionOrder] = useState(() => {
    const saved = localStorage.getItem('sidebarSectionOrder');
    return saved ? JSON.parse(saved) : navSections.map((_, idx) => idx);
  });

  const toggleSection = (idx: number) => {
    setOpenSections(prev => prev.map((open, i) => (i === idx ? !open : open)));
  };

  const sectionShortcuts = navSections.map((_, idx) => `Alt+${idx + 1}`);

  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key >= '1' && e.key <= String(navSections.length)) {
        const idx = Number(e.key) - 1;
        const firstLink = navSections[idx]?.links?.[0]?.path;
        if (firstLink) window.location.href = firstLink;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { localStorage.setItem('sidebarSectionOrder', JSON.stringify(sectionOrder)); }, [sectionOrder]);

  const orderedSections = sectionOrder.map(idx => navSections[idx]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(sectionOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setSectionOrder(newOrder);
  };

  return (
    <nav className={`flex flex-col gap-2 p-4 border-r min-w-[220px] h-full w-full overflow-y-auto glass-morphic ${sidebarBgClass} transition-all duration-500 ease-in-out shadow-glow-xl border-animated ${miniMode ? 'w-16 min-w-[64px] px-1' : ''}`} aria-label="Main navigation sidebar">
      <div className="flex items-center gap-3 mb-6 justify-between">
        <div className="flex items-center gap-3">
          <UserMenu />
          <div className="text-2xl font-bold text-blue-700 tracking-tight px-2 select-none">Fleet Asphalt Nexus</div>
        </div>
        <NotificationCenter />
      </div>
      <hr className="mb-4 border-gray-200" />
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Quick search..."
          aria-label="Quick search navigation"
          className="flex-1 px-3 py-2 rounded border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
        />
      </div>
      <TooltipProvider>
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Quick Actions</div>
          <div className="flex flex-col gap-2">
            {quickActions.map(({ path, label, icon, description }) => {
              const Icon = icon && LucideIcons[icon] ? LucideIcons[icon] : LucideIcons['Circle'];
              return (
                <Tooltip key={path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={path}
                      className="flex items-center gap-2 px-3 py-2 rounded bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-all duration-200 border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{description}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar-sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {orderedSections.map((section, idx) => (
                <Draggable key={section.title} draggableId={section.title} index={idx} isDragDisabled={miniMode}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={`transition-all duration-300 ${dragSnapshot.isDragging ? 'ring-2 ring-primary/60 bg-accent/20' : ''}`}
                    >
                      <Collapsible key={section.title} open={openSections[sectionOrder[idx]]}>
                        <CollapsibleTrigger
                          onClick={() => toggleSection(sectionOrder[idx])}
                          className="flex items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
                          aria-expanded={openSections[sectionOrder[idx]]}
                          title={`Shortcut: ${sectionShortcuts[sectionOrder[idx]]}`}
                        >
                          <span className="flex items-center gap-2">
                            {!miniMode && <span {...dragProvided.dragHandleProps} className="cursor-grab active:cursor-grabbing"><GripVertical className="h-4 w-4 text-muted-foreground" /></span>}
                            {('icon' in section) && section.icon && LucideIcons[section.icon] && (
                              <span className="h-4 w-4 text-primary animate-shimmer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{backgroundSize:'200% 200%', animation:'shimmer 2s linear infinite'}}>
                                {React.createElement(LucideIcons[section.icon], {className:'h-4 w-4'})}
                              </span>
                            )}
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-shimmer" style={{backgroundSize:'200% 200%', animation:'shimmer 2s linear infinite'}}>{section.title}</span>
                          </span>
                          <span className={`transition-transform duration-200 ${openSections[sectionOrder[idx]] ? 'rotate-90' : ''}`}>▶</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-2">
                          {section.links.filter(({ label }) => label.toLowerCase().includes(searchTerm.toLowerCase())).map(({ path, label, icon, badge, description }) => {
                            const isActive = location.pathname === path;
                            const Icon = icon && LucideIcons[icon] ? LucideIcons[icon] : LucideIcons['Circle'];
                            const highlighted = label.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0;
                            return (
                              <Tooltip key={path}>
                                <TooltipTrigger asChild>
                                  <Link
                                    to={path}
                                    className={`relative flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 border-l-4 mt-1 overflow-hidden ${
                                      isActive ? 'bg-accent text-primary font-semibold shadow border-primary' : 'hover:bg-accent hover:text-primary border-transparent'
                                    } ${highlighted ? 'ring-2 ring-primary/60' : ''}`}
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={label}
                                    onMouseDown={e => {
                                      const ripple = document.createElement('span');
                                      ripple.className = 'ripple';
                                      ripple.style.left = `${e.nativeEvent.offsetX}px`;
                                      ripple.style.top = `${e.nativeEvent.offsetY}px`;
                                      e.currentTarget.appendChild(ripple);
                                      setTimeout(() => ripple.remove(), 600);
                                    }}
                                  >
                                    <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:animate-bounce`} />
                                    <span>{label}</span>
                                    {badge && <Badge variant="secondary" className="ml-auto animate-pulse bg-red-500 text-white">{badge}</Badge>}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>{description}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-auto pt-6 flex flex-col gap-2">
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded bg-accent/80 text-primary font-semibold shadow hover:bg-accent transition-all duration-200 border border-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={() => setShowTheme(true)}
          aria-label="Open Theme Customizer"
        >
          <Palette className="h-5 w-5" />
          {!miniMode && 'Theme Customizer'}
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex items-center justify-center w-full px-3 py-2 rounded bg-muted text-muted-foreground hover:bg-accent transition-all duration-200 border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                onClick={() => { setMiniMode(v => { localStorage.setItem('sidebarMiniMode', String(!v)); return !v; }); }}
                aria-label={miniMode ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <LucideIcons.ChevronsLeft className={`h-5 w-5 transition-transform duration-200 ${miniMode ? 'rotate-180' : ''}`} />
              </button>
            </TooltipTrigger>
            <TooltipContent>{miniMode ? 'Expand sidebar' : 'Collapse sidebar'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <ThemeIntegration
            onSidebarBgChange={setSidebarBgClass}
            sidebarBgClass={sidebarBgClass}
          />
        </div>
      )}
      <style>{`
        .ripple {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.08);
          border-radius: 50%;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s linear;
          z-index: 1;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation; 