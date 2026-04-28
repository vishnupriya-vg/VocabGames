import type { Screen } from '../../types';
import styles from './BottomNav.module.css';
import { useGame } from '../../store/useGame';
import { navigateTo } from '../../store/actions';

const NAV_ITEMS = [
  { screen: 'HOME' as Screen, label: 'Home', icon: '🏠' },
  { screen: 'LEVEL_MAP' as Screen, label: 'Levels', icon: '🗺️' },
  { screen: 'PROFILE' as Screen, label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  const { state, dispatch } = useGame();
  const active = state.screen;

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.screen}
          className={`${styles.item} ${active === item.screen ? styles.active : ''}`}
          onClick={() => dispatch(navigateTo(item.screen))}
          aria-current={active === item.screen ? 'page' : undefined}
          aria-label={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
