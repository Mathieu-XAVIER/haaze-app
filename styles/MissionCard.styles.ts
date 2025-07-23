import { StyleSheet } from 'react-native';

export const stylesIncomplete = StyleSheet.create({
  border: {
    width: '100%',
    marginBottom: 16,
    padding: 1.5,
  },
  gap: {
    backgroundColor: '#0A0A0A',
    margin: 0,
  },
  innerContent: {
    backgroundColor: '#0A0A0A',
    minHeight: 70,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Minasans',
    marginBottom: 8,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    flex: 1,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Helvetica',
    minWidth: 36,
    textAlign: 'right',
  },
  xp: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Minasans',
    marginLeft: 8,
  },
  xpPlus: {
    color: '#FF3600',
    fontSize: 18,
    fontFamily: 'Minasans',
  },
});

export const stylesComplete = StyleSheet.create({
  card: {
    width: '100%',
    height: 48,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 18,
    zIndex: 2,
  },
  leftText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Minasans',
    letterSpacing: 1.2,
  },
  rightText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Minasans',
    letterSpacing: 1.2,
  },
});
