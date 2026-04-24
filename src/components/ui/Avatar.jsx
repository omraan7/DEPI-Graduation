export default function Avatar({ initials, color = 'var(--primary)', size = 40, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '18', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700,
      flexShrink: 0, ...style,
    }}>
      {initials}
    </div>
  );
}
