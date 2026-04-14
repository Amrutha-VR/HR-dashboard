import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Users } from 'lucide-react';
import Avatar from './Avatar';
import { BandBadge, StatusBadge } from './Badge';
import type { OrgNode } from '../types';

interface OrgChartNodeProps {
  node: OrgNode;
  depth: number;
  highlightId: string | null;
  expandedSet: Set<string>;
  onToggle: (id: string) => void;
}

/**
 * A single node card in the visual org chart.
 * Renders the employee card and recursively renders children
 * in a top-to-bottom, centered tree layout with SVG connectors.
 */
export default function OrgChartNode({ node, depth, highlightId, expandedSet, onToggle }: OrgChartNodeProps) {
  const navigate = useNavigate();
  const { employee, children } = node;
  const hasChildren = children.length > 0;
  const isExpanded = expandedSet.has(employee.id);
  const isHighlighted = employee.id === highlightId;
  const isRoot = depth === 0 && employee.managerId === null;

  return (
    <div className="flex flex-col items-center">
      {/* ── Node card ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(depth * 0.06, 0.25) }}
        className={`
          relative group rounded-xl border px-4 py-3 w-[210px]
          transition-all duration-200 cursor-pointer select-none
          ${isHighlighted
            ? 'border-amber-300 bg-amber-50/60 shadow-[0_0_0_2px_rgba(217,179,88,0.25)] ring-1 ring-amber-200'
            : isRoot
              ? 'border-neutral-300 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
              : 'border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-neutral-300 hover:shadow-md'
          }
        `}
        onClick={() => hasChildren && onToggle(employee.id)}
      >
        {/* Avatar + info */}
        <div className="flex items-center gap-2.5 mb-2">
          <Avatar firstName={employee.firstName} lastName={employee.lastName} id={employee.id} avatar={employee.avatar} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-neutral-800 truncate leading-tight">{employee.fullName}</p>
            <p className="text-[10px] text-neutral-400 truncate">{employee.employeeCode}</p>
          </div>
        </div>

        {/* Designation + department */}
        <p className="text-[11px] text-neutral-600 truncate leading-snug" title={employee.designation}>
          {employee.designation}
        </p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{employee.department}</p>

        {/* Bottom row: band, status, children count */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5">
            <BandBadge band={employee.band} />
            <StatusBadge status={employee.status} />
          </div>
          {hasChildren && (
            <span className="flex items-center gap-0.5 text-[10px] text-neutral-400 font-medium">
              <Users size={10} /> {children.length}
            </span>
          )}
        </div>

        {/* Hover action → detail */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/employee/${employee.id}`);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 transition-all p-1 rounded-md hover:bg-stone-100"
          title="View full details"
        >
          <ExternalLink size={12} />
        </button>

        {/* Expand / collapse indicator */}
        {hasChildren && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`
                w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center
                text-[10px] font-bold transition-colors
                ${isExpanded ? 'border-neutral-400 text-neutral-500' : 'border-neutral-300 text-neutral-400'}
              `}
            >
              {isExpanded ? '−' : '+'}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Children layer ──────────────────────────── */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center mt-3">
          {/* Vertical connector from parent to branch point */}
          <div className="w-px h-6 bg-neutral-200" />

          {/* Horizontal rail + vertical drops + child nodes */}
          {children.length === 1 ? (
            /* Single child — straight vertical line */
            <div className="flex flex-col items-center">
              <OrgChartNode
                node={children[0]}
                depth={depth + 1}
                highlightId={highlightId}
                expandedSet={expandedSet}
                onToggle={onToggle}
              />
            </div>
          ) : (
            /* Multiple children — horizontal rail with branches */
            <div className="relative flex items-start gap-6">
              {/* The horizontal rail line spanning from first child center to last child center */}
              <div
                className="absolute bg-neutral-200"
                style={{
                  height: '1px',
                  top: 0,
                  /* Half of the first card + gap adjustments */
                  left: 'calc(105px)',
                  right: 'calc(105px)',
                }}
              />

              {children.map((child) => (
                <div key={child.employee.id} className="flex flex-col items-center">
                  {/* Vertical drop from horizontal rail to child node */}
                  <div className="w-px h-6 bg-neutral-200" />
                  <OrgChartNode
                    node={child}
                    depth={depth + 1}
                    highlightId={highlightId}
                    expandedSet={expandedSet}
                    onToggle={onToggle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
