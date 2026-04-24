const VARIANTS = {
  primary:   { bg: 'var(--primary)',   color: '#fff', border: 'transparent', hover: 'var(--primary-dark)' },
  secondary: { bg: 'transparent',      color: 'var(--primary)', border: 'var(--primary)', hover: 'var(--primary-light)' },
  ghost:     { bg: 'transparent',      color: 'var(--gray-700)', border: 'var(--gray-200)', hover: 'var(--gray-100)' },
  danger:    { bg: 'var(--danger)',    color: '#fff', border: 'transparent', hover: '#dc2626' },
  white:     { bg: '#fff',             color: 'var(--primary)', border: '#fff', hover: 'var(--primary-light)' },
};

const SIZES = {
  sm: { padding: '7px 16px', fontSize: 13, height: 34 },
  md: { padding: '10px 22px', fontSize: 14, height: 42 },
  lg: { padding: '13px 28px', fontSize: 15, height: 50 },
  xl: { padding: '16px 36px', fontSize: 16, height: 58 },
};

export default function Button({
  children, variant = 'primary', size = 'md',
  fullWidth = false, disabled = false, loading = false,
  icon, iconRight, style = {}, onClick, type = 'button',
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, height: s.height, padding: s.padding,
        fontSize: s.fontSize, fontWeight: 600, lineHeight: 1,
        background: v.bg, color: v.color,
        border: `1.5px solid ${v.border}`,
        borderRadius: 'var(--radius-md)',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all .15s ease',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = v.hover; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = v.bg; }}
    >
      {loading
        ? <span style={{ width:16, height:16, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
        : icon && <span style={{ fontSize: s.fontSize + 2 }}>{icon}</span>
      }
      {children}
      {iconRight && !loading && <span style={{ fontSize: s.fontSize + 2 }}>{iconRight}</span>}
    </button>
  );
}
