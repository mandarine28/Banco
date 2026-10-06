import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { FlagIcon } from '@/components/FlagIcon';
import { LANGUAGES } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

export function LanguagePicker() {
  const [lang, setLang] = useState<Lang>('fr');
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const wrapRef = useRef<View>(null);

  const handleToggle = () => {
    if (open) { setOpen(false); return; }
    wrapRef.current?.measure((_fx, _fy, _w, height, px, py) => {
      setDropdownTop(py + height + 6);
      setDropdownLeft(px);
      setOpen(true);
    });
  };

  const handleSelect = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <>
      <View ref={wrapRef} collapsable={false}>
        <Pressable
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          onPress={handleToggle}
          accessibilityRole="button"
          accessibilityLabel="Changer de langue"
          hitSlop={6}
        >
          <View style={styles.flagCircle}>
            <FlagIcon lang={lang} size={34} />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1 }}>
          {/* Dark overlay – visuel uniquement, ne capte pas les touches */}
          <View style={[StyleSheet.absoluteFillObject, styles.backdrop]} pointerEvents="none" />
          {/* Zone plein-écran qui ferme le dropdown au tap */}
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <Pressable
            style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}
            onPress={() => {}}
          >
            {LANGUAGES.map(({ code, label }, idx) => {
              const isActive = code === lang;
              const isLast = idx === LANGUAGES.length - 1;
              return (
                <Pressable
                  key={code}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && styles.rowBorder,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() => handleSelect(code)}
                  accessibilityRole="menuitem"
                >
                  <View style={styles.flagSmall}>
                    <FlagIcon lang={code} size={30} />
                  </View>
                  <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
                  {isActive && <Text style={styles.check}>✓</Text>}
                </Pressable>
              );
            })}
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  pillPressed: { opacity: 0.75 },
  flagCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fffbf5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(12,45,100,0.18)',
    minWidth: 172,
    shadowColor: colors.purpleDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(12,45,100,0.1)',
  },
  rowPressed: { backgroundColor: 'rgba(12,45,100,0.06)' },
  flagSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  label: {
    flex: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
  },
  labelActive: {
    fontFamily: fonts.display,
    color: colors.purple,
  },
  check: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.purple,
  },
});
