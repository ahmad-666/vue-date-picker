<template>
  <div>
    <v-sheet color="cardColor" width="100%">
      <div class="pa-1 pa-md-4">
        <div class="d-flex align-center justify-space-between">
          <v-btn v-if="canChangeMonth" text small @click="prevMonth">
            <v-icon size="20"> mdi-chevron-right </v-icon>
          </v-btn>

          <h6 class="text-subtitle-1">
            {{ firstColMonth.monthName }} {{ firstColMonth.year }}
          </h6>

          <h6 v-if="!isMobile && monthNum === 2" class="text-subtitle-1">
            {{ secondColMonth.monthName }} {{ secondColMonth.year }}
          </h6>
          <v-btn v-if="canChangeMonth" text small @click="nextMonth">
            <v-icon size="20"> mdi-chevron-left </v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div
        class="pa-0 pa-md-4 d-flex flex-column align-center flex-md-row overflow-y-auto"
        :class="{
          'justify-center': monthNum === 1 || isMobile,
          'justify-md-space-between': monthNum === 2,
        }"
        :style="{ 'max-height': '75vh' }"
      >
        <div
          v-for="(colMonthChunks, i) in chunksArray"
          :key="`chunk-${i}`"
          class="mx-auto"
        >
          <div class="d-flex justify-space-between">
            <p
              v-for="weekday in weekdays"
              :key="weekday"
              class="text-caption d-flex flex-column align-center justify-center ma-1 pa-1"
              :style="{ width: `${dayWidth}px`, height: `${dayHeight}px` }"
            >
              {{ weekday }}
            </p>
          </div>
          <div class="mt-2">
            <div
              v-for="(rows, i) in colMonthChunks"
              :key="`rows-${i}`"
              class="my-1 d-flex justify-space-between"
            >
              <div v-for="(day, j) in rows" :key="`cols-${j}`">
                <div
                  :style="{
                    width: `${dayWidth}px`,
                    height: `${dayHeight}px`,
                  }"
                  class="calendar-day overflow-hidden pa-1 ma-1 rounded-lg calendar-day"
                >
                  <template v-if="day.monthStatus === 'curr'">
                    <div
                      v-if="!$scopedSlots.day"
                      class="rounded-lg width-100 fill-height d-flex justify-center align-center text-caption"
                      :class="dayCssClasses(day)"
                      @click="selectDay(day)"
                    >
                      <p>
                        {{ day.day }}
                      </p>
                    </div>
                    <slot v-else name="day" :day="day"></slot>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="pa-2">
        <div>
          <div v-for="legend in legends" :key="legend.title" class="my-1">
            <div class="d-flex align-center flex-wrap">
              <v-sheet
                width="15"
                height="15"
                :color="legend.color"
                class="rounded-circle"
              ></v-sheet>
              <h6
                class="mr-2 font-weight-regular direction-rtl text-subtitle-1"
              >
                {{ legend.title }}
              </h6>
            </div>
          </div>
          <slot v-if="$slots.legends" name="legends"></slot>
        </div>
        <div class="d-flex justify-space-between align-center flex-wrap">
          <h6 class="text-subtitle-1">
            {{ selectedText }}
          </h6>
          <v-btn
            v-if="clearable"
            :color="color"
            dark
            depressed
            class="px-8"
            @click="clear"
          >
            پاک کردن
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <v-snackbar v-model="showError" color="red" dark :timeout="3000">
      {{ errorText }}
    </v-snackbar>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Array],
      default: () => [null, null],
      validator: val => {
        if (val === null || typeof val === 'string' || Array.isArray(val))
          return true;
        return false;
      },
    },
    startDate: {
      type: String, // must be in 'YYYY/MM/DD' format regardless of 'format' prop
      default: null,
      validator: val => {
        if (val === null || typeof val === 'string') return true;
        return false;
      },
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    range: {
      type: Boolean,
      default: false,
    },
    monthNum: {
      type: Number,
      default: 1,
      validator: val => {
        if (
          val === null ||
          typeof val === 'undefined' ||
          val === 1 ||
          val === 2
        )
          return true;
        return false;
      },
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    canChangeMonth: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'teal',
    },
    weekendColor: {
      type: String,
      default: 'red',
    },
    todayColor: {
      type: String,
      default: 'green accent-3',
    },
  },
  emits: ['input', 'close'],
  data() {
    const startDate = this.startDate || this.$dayjs().format('YYYY/MM/DD');
    const d = this.$dayjs(startDate, {
      jalali: true,
    });
    return {
      firstColDate: d.format('YYYY/MM'),
      secondColDate: d.clone().add(1, 'month').format('YYYY/MM'),
      showError: false,
      errorText: null,
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    chunksArray() {
      if (!this.isMobile && this.monthNum === 2) {
        return [this.firstColMonthChunks, this.secondColMonthChunks];
      }
      return [this.firstColMonthChunks];
    },
    dayWidth() {
      if (!this.dense && !this.isMobile) return 60;
      else return 30;
    },
    dayHeight() {
      if (!this.dense && !this.isMobile) return 55;
      else return 35;
    },
    dayIndicatorPosOffset() {
      if (!this.dense && !this.isMobile) return 22;
      else return 16;
    },
    dayIndicatorWidth() {
      if (!this.dense && !this.isMobile) return 30;
      else return 22;
    },
    dayIndicatorHeight() {
      if (!this.dense && !this.isMobile) return 15;
      else return 10;
    },
    today() {
      return this.$dayjs().format(this.format);
    },
    firstColMonth() {
      return this.getMonthInfo(this.firstColDate, 'firstColMonth');
    },
    firstColMonthChunks() {
      if (
        this.firstColMonth &&
        this.firstColMonth.days &&
        Array.isArray(this.firstColMonth.days)
      ) {
        return this.chunkArray(this.firstColMonth.days, 7);
      }
      return [];
    },
    secondColMonth() {
      return this.getMonthInfo(this.secondColDate, 'secondColMonth');
    },
    secondColMonthChunks() {
      if (
        this.secondColMonth &&
        this.secondColMonth.days &&
        Array.isArray(this.secondColMonth.days)
      ) {
        return this.chunkArray(this.secondColMonth.days, 7);
      }
      return [];
    },
    selectedText() {
      if (!this.range && this.value) {
        const date = this.$dayjs(this.value, {
          jalali: true,
        }).format('D MMMM YYYY');
        return date;
      } else if (this.range && this.value[0] && this.value[1]) {
        const start = this.$dayjs(this.value[0], {
          jalali: true,
        }).format('D MMMM YYYY');
        const end = this.$dayjs(this.value[1], {
          jalali: true,
        }).format('D MMMM YYYY');
        return `${start} - ${end}`;
      }
      return null;
    },
    weekdays() {
      return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    },
    legends() {
      const arr = [
        {
          title: 'امروز',
          color: this.todayColor,
          show: true,
        },
        {
          title: 'روزهای رزرو شده شما',
          color: this.color,
          show: true,
        },
      ];
      return arr.filter(a => a.show);
    },
  },
  methods: {
    prevMonth() {
      this.firstColDate = this.$dayjs(this.firstColDate, {
        jalali: true,
      })
        .clone()
        .subtract(1, 'month')
        .format('YYYY/MM');
      this.secondColDate = this.$dayjs(this.secondColDate, {
        jalali: true,
      })
        .clone()
        .subtract(1, 'month')
        .format('YYYY/MM');
    },
    nextMonth() {
      this.firstColDate = this.$dayjs(this.firstColDate, {
        jalali: true,
      })
        .clone()
        .add(1, 'month')
        .format('YYYY/MM');
      this.secondColDate = this.$dayjs(this.secondColDate, {
        jalali: true,
      })
        .clone()
        .add(1, 'month')
        .format('YYYY/MM');
    },
    getMonthInfo(targetDate, label) {
      const m = this.$dayjs(targetDate, { jalali: true });
      const days = []; // this array has 7(weekdays)*6(rows number) elements and can have last days of prev month or first days of next month
      const firstDayOfMonth = this.$dayjs(`${targetDate}/1`, {
        jalali: true,
      });
      const firstDayOnMonthIndex = firstDayOfMonth.weekday();
      const daysInMonth = this.$dayjs(targetDate, {
        jalali: true,
      }).daysInMonth();
      const lastDayOfMonth = this.$dayjs(`${targetDate}/${daysInMonth}`, {
        jalali: true,
      });
      const lastDayOfMonthIndex =
        +lastDayOfMonth.format('D') + firstDayOnMonthIndex - 1;
      for (let i = 0; i < 42; i++) {
        // last days of prev month can only be on first row
        // first days of next month can only be on last row
        let monthStatus = null;
        let currentDay = null;
        let dayOffset = null;
        if (i < firstDayOnMonthIndex) {
          // last days of prev month
          monthStatus = 'prev';
          dayOffset = firstDayOnMonthIndex - i;
          currentDay = firstDayOfMonth.clone().subtract(dayOffset, 'day');
        } else if (i > lastDayOfMonthIndex) {
          // first days of next month
          monthStatus = 'next';
          dayOffset = i - lastDayOfMonthIndex;
          currentDay = lastDayOfMonth.clone().add(dayOffset, 'day');
        } else {
          // days of current month
          monthStatus = 'curr';
          dayOffset = i - firstDayOnMonthIndex;
          currentDay = firstDayOfMonth.clone().add(dayOffset, 'day');
        }
        days.push({
          label,
          day: +currentDay.format('D'), // day number
          dayFormat: currentDay.format(this.format),
          weekdayText: +currentDay.weekday(), // saturday,sunday,...
          monthStatus, // 'prev,'curr','next',
          monthNumber: +currentDay.format('M'),
          monthName: currentDay.format('MMMM'),
        });
      }
      const year = +m.format('YYYY');
      const monthNumber = +m.format('M');
      return {
        year,
        monthName: m.format('MMMM'),
        monthNumber, // from [1,12]
        daysNumber: this.$dayjs(`${year}/${monthNumber}`, {
          jalali: true,
        }).daysInMonth(),
        days,
      };
    },
    selectDay(day) {
      if (!this.range) {
        this.$emit('input', day.dayFormat);
        this.$emit('close');
      } else if (
        (!this.value[0] && !this.value[1]) ||
        (this.value[0] && this.value[1])
      ) {
        this.$emit('input', [day.dayFormat, null]);
      } else if (this.value[0] && !this.value[1]) {
        if (this.value[0] !== day.dayFormat) {
          if (
            this.$dayjs(day.dayFormat, {
              jalali: true,
            }).isBefore(
              this.$dayjs(this.value[0], {
                jalali: true,
              })
            )
          )
            this.$emit('input', [day.dayFormat, null]);
          else {
            this.$emit('input', [this.value[0], day.dayFormat]);
            this.$emit('close');
          }
        } else return null;
      }
      return null;
    },
    dayCssClasses(day) {
      const monthStatus = day.monthStatus;
      const isHoliday = day.weekdayText === 6; // friday of holiday
      const isToday = this.today === day.dayFormat;
      // only for non-range mode
      const isSelected = !this.range && this.value === day.dayFormat;
      // only for range mode:
      const isFirstVal = this.range && this.value[0] === day.dayFormat;
      const isSecondVal = this.range && this.value[1] === day.dayFormat;
      const isBetween =
        this.range &&
        this.value[0] &&
        this.value[1] &&
        this.$dayjs(day.dayFormat, { jalali: true }).isBetween(
          this.$dayjs(this.value[0], { jalali: true }),
          this.$dayjs(this.value[1], { jalali: true })
        );
      // background-color -----------------------------
      // background-color -----------------------------
      // background-color -----------------------------
      let backgroundColor = null;
      if (monthStatus === 'prev' || monthStatus === 'next')
        backgroundColor = 'transparent';
      else if (isSelected) backgroundColor = this.color;
      else if (isFirstVal || isSecondVal) backgroundColor = this.color;
      else if (isBetween) backgroundColor = `${this.color} lighten-2`;
      else if (isToday) backgroundColor = this.todayColor;
      // text-color -----------------------------
      // text-color -----------------------------
      // text-color -----------------------------
      let textColor = null;
      if (monthStatus === 'prev' || monthStatus === 'next')
        textColor = 'transparent--text';
      else if (isHoliday) textColor = `${this.weekendColor}--text`;
      else textColor = 'titleColor--text';
      // final css classes -------------------------
      // final css classes -------------------------
      // final css classes -------------------------
      const cssClasses = {
        [backgroundColor]: true,
        [textColor]: true,
        'cursor-pointer': true,
      };
      return cssClasses;
    },
    clear() {
      if (!this.range) this.$emit('input', null);
      else this.$emit('input', [null, null]);
    },
    chunkArray(arr, chunkSize) {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
.width-100 {
  width: 100% !important;
}

.overflow-y-auto {
  overflow-y: auto !important;
}
.position-relative {
  position: relative !important;
}
.position-absolute {
  position: absolute !important;
}
.overflow-hidden {
  overflow: hidden !important;
}
.cursor-pointer {
  cursor: pointer !important;
}
.pointer-events-none {
  pointer-events: none !important;
}
.border-dash {
  border: 1px dashed #aaa !important;
}
.direction-rtl {
  direction: rtl !important;
}
.direction-ltr {
  direction: ltr !important;
}
</style>
