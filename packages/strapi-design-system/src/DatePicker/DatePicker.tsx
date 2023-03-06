import { useRef, useState } from 'react';

import { Calendar as CalendarIcon, Cross } from '@strapi/icons';

import { DatePickerWrapper, IconBox } from './components';
import { DatePickerCalendar, DatePickerCalendarProps } from './DatePickerCalendar';
import { formatDate } from './utils/formatDate';
import { getDefaultLocale } from '../helpers/getDefaultLocale';
import { TextInput, TextInputProps } from '../TextInput';

/**
 * TODO: this can be refactored into two pieces – DatePickerInput and DatePicker.
 * The former is litterally just the input and would play nicer with the props of
 * DateTimePicker which doesn't want it to render it's own label (understandable).
 */
export interface DatePickerProps
  extends Omit<TextInputProps, 'onChange'>,
    Pick<DatePickerCalendarProps, 'onChange' | 'maxDate' | 'minDate' | 'selectedDate' | 'initialDate' | 'locale'> {
  ariaLabel?: string;
  clearLabel?: string;
  onClear?: () => void;
  /**
   * @deprecated This is no longer used.
   */
  selectedDateLabel?: (date: string) => string;
}

export const DatePicker = ({
  /**
   * DatePicker props
   */
  ariaLabel,
  onClear,
  clearLabel = 'Clear',
  /**
   * DatePickerCalendar props
   */
  initialDate,
  locale: defaultLocale,
  maxDate,
  minDate,
  onChange,
  selectedDate,
  /**
   * TextInput props
   */
  disabled = false,
  ...props
}: DatePickerProps) => {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<{ inputWrapperRef: React.MutableRefObject<HTMLDivElement> }>(null!);
  const locale = defaultLocale || getDefaultLocale();
  const formattedDate = selectedDate ? formatDate(selectedDate, locale) : '';

  const toggleVisibility = () => {
    if (disabled) return;
    setVisible((prevVisible) => !prevVisible);
  };

  const handleClear = () => {
    if (disabled) return;

    if (onClear) {
      onClear();
      /**
       * TODO: refactor this so we can just target the input...?
       */
      inputRef.current.inputWrapperRef.current.focus();
    }
  };

  const handleChange = (date: Date) => {
    if (onChange) {
      onChange(date);
    }
    setVisible(false);
  };

  const handleEscape = () => {
    setVisible(false);
  };

  return (
    <DatePickerWrapper bold={visible}>
      <TextInput
        ref={inputRef}
        onClick={toggleVisibility}
        // Prevent input from changing for now
        onChange={() => {}}
        value={formattedDate}
        startAction={<CalendarIcon aria-hidden />}
        endAction={
          onClear && formattedDate ? (
            <IconBox as="button" onClick={handleClear} aria-label={clearLabel} aria-disabled={disabled}>
              <Cross />
            </IconBox>
          ) : undefined
        }
        aria-autocomplete="none"
        aria-label={ariaLabel}
        disabled={disabled}
        {...props}
      />

      {inputRef.current && inputRef.current.inputWrapperRef && visible && (
        <DatePickerCalendar
          selectedDate={selectedDate}
          initialDate={initialDate}
          onChange={handleChange}
          onEscape={handleEscape}
          locale={locale}
          popoverSource={inputRef.current.inputWrapperRef}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </DatePickerWrapper>
  );
};
