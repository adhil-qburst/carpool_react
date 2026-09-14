import FieldIcon from "@shared/ui/FieldIcon";

export interface DepartureScheduleFieldsProps {
  departureDate: string;
  departureTime: string;
  todayString: string;
  onChangeDate: (date: string) => void;
  onChangeTime: (time: string) => void;
  dateError?: string;
  timeError?: string;
}

export default function DepartureScheduleFields({
  departureDate,
  departureTime,
  todayString,
  onChangeDate,
  onChangeTime,
  dateError,
  timeError,
}: DepartureScheduleFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Date Field */}
      <div>
        <label
          htmlFor="departure-date"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Departure Date <span className="text-rose-500">*</span>
        </label>
        <div className="relative text-slate-400">
          <span className="pointer-events-none absolute left-3.5 top-3.5">
            <FieldIcon type="calendar" />
          </span>
          <input
            id="departure-date"
            type="date"
            min={todayString}
            value={departureDate}
            onChange={(e) => onChangeDate(e.target.value)}
            aria-invalid={Boolean(dateError)}
            aria-describedby={dateError ? "departure-date-error" : undefined}
            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-[15px] text-slate-900 outline-none transition focus:ring-4 ${
              dateError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
            }`}
          />
        </div>
        {dateError && (
          <p id="departure-date-error" className="mt-1.5 text-sm text-rose-600">
            {dateError}
          </p>
        )}
      </div>

      {/* Time Field */}
      <div>
        <label
          htmlFor="departure-time"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Departure Time <span className="text-rose-500">*</span>
        </label>
        <div className="relative text-slate-400">
          <span className="pointer-events-none absolute left-3.5 top-3.5">
            <FieldIcon type="clock" />
          </span>
          <input
            id="departure-time"
            type="time"
            value={departureTime}
            onChange={(e) => onChangeTime(e.target.value)}
            aria-invalid={Boolean(timeError)}
            aria-describedby={timeError ? "departure-time-error" : undefined}
            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-[15px] text-slate-900 outline-none transition focus:ring-4 ${
              timeError
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
            }`}
          />
        </div>
        {timeError && (
          <p id="departure-time-error" className="mt-1.5 text-sm text-rose-600">
            {timeError}
          </p>
        )}
      </div>
    </div>
  );
}
