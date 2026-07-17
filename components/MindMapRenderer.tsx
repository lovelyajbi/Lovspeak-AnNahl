
import React, { useState } from 'react';
import { MindMapNode } from '../types';

interface MindMapRendererProps {
  data: MindMapNode;
}

const NodeItem: React.FC<{ node: MindMapNode; isRoot?: boolean }> = ({ node, isRoot = false }) => {
  const [isOpen, setIsOpen] = useState(node.isInitiallyOpen ?? (isRoot || node.type === 'main'));
  const hasChildren = node.children && node.children.length > 0;

  // Determine styles based on node type
  let containerClass = "relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group";
  let labelClass = "font-bold text-gray-800 dark:text-white";
  let detailClass = "text-[8px] md:text-[10px] mt-1 text-gray-500 dark:text-gray-400 font-medium";
  let icon = "";

  switch (node.type) {
    case 'root':
      containerClass += " bg-gradient-to-br from-lovelya-500 to-purple-600 text-white shadow-xl border-transparent scale-105 mb-6";
      labelClass = "text-lg md:text-xl font-black text-white tracking-tight";
      detailClass = "text-[10px] md:text-xs text-white/80 font-medium";
      icon = "fa-brain";
      break;
    case 'main':
      containerClass += " bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-lovelya-200 dark:border-lovelya-800 shadow-sm hover:shadow-md hover:border-lovelya-400";
      labelClass = "text-sm md:text-base text-lovelya-700 dark:text-lovelya-300";
      icon = "fa-project-diagram";
      break;
    case 'sub':
      containerClass += " bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700";
      labelClass = "text-[10px] md:text-[13px] text-gray-700 dark:text-gray-200";
      break;
    case 'formula':
      containerClass += " bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      labelClass = "text-[10px] md:text-[13px] font-mono text-blue-700 dark:text-blue-300";
      icon = "fa-calculator";
      break;
    case 'warning':
      containerClass += " bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      labelClass = "text-[10px] md:text-[13px] text-red-700 dark:text-red-300";
      icon = "fa-exclamation-triangle";
      break;
    case 'example':
      containerClass += " bg-lovelya-50/80 dark:bg-lovelya-900/20 border-lovelya-200 dark:border-lovelya-800 font-serif italic";
      labelClass = "text-[10px] md:text-[13px] text-lovelya-700 dark:text-lovelya-300";
      icon = "fa-quote-left";
      break;
  }

  return (
    <div className="relative">
      {/* Connector Line (Vertical) - Only for children */}
      {!isRoot && (
        <div className="absolute -left-[22px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 group-last:h-8">
           {/* Curve to node */}
           <div className="absolute top-8 -left-px w-[22px] h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
      )}

      {/* The Node Card */}
      <div 
        onClick={(e) => { e.stopPropagation(); if (hasChildren) setIsOpen(!isOpen); }}
        className={`${containerClass} select-none`}
      >
        <div className="flex items-start justify-between gap-3">
           <div className="flex-1">
              <div className="flex items-center gap-2">
                 {icon && <i className={`fas ${icon} opacity-70 text-xs`}></i>}
                 <span className={labelClass}>{node.label}</span>
              </div>
              {node.detail && <p className={detailClass}>{node.detail}</p>}
           </div>
           
           {/* Expand/Collapse Icon */}
           {hasChildren && (
             <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${node.type === 'root' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'} ${isOpen ? 'rotate-180' : ''}`}>
                <i className="fas fa-chevron-down text-xs"></i>
             </div>
           )}
        </div>
      </div>

      {/* Children Container (Animated) */}
      <div className={`
         ml-6 pl-4 border-l-2 border-dashed border-gray-200 dark:border-gray-700
         overflow-hidden transition-all duration-500 ease-in-out
         ${isOpen ? 'max-h-[2000px] opacity-100 mt-4 pb-2' : 'max-h-0 opacity-0 mt-0'}
      `}>
         {hasChildren && node.children!.map((child) => (
            <NodeItem key={child.id} node={child} />
         ))}
      </div>
    </div>
  );
};

const MindMapRenderer: React.FC<MindMapRendererProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <i className="fas fa-network-wired text-9xl"></i>
       </div>
       <NodeItem node={data} isRoot={true} />
    </div>
  );
};

export default MindMapRenderer;
