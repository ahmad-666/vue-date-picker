<template>
  <div>
    <v-dialog width="1050" max-width="95vw">
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="date2"
          v-bind="attrs"
          label="simple date"
          outlined
          class="mt-10"
          v-on="on"
        ></v-text-field>
      </template>
      <template #default="dialog">
        <custom-date-picker
          v-model="date2"
          range
          :dense="false"
          :month-num="2"
          @close="dialog.value = false"
        >
        </custom-date-picker>
      </template>
    </v-dialog>
    <v-dialog v-model="showCalendar" width="1050" max-width="95vw">
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          v-bind="attrs"
          label="date-picker with slots"
          outlined
          class="mt-10"
          v-on="on"
        ></v-text-field>
      </template>
      <template #default="dialog">
        <custom-date-picker
          v-model="date"
          :range="range"
          :dense="false"
          :month-num="2"
          @close="dialog.value = false"
        >
          <template #day="{ day }">
            <div
              class="width-100 fill-height d-flex flex-column align-center justify-center position-relative text-caption rounded-lg"
              :class="dayCssClasses(day)"
              @click="selectDay(day)"
            >
              <p class="text-caption">
                {{ day.day }}
              </p>
              <p
                v-if="
                  getDay(day) &&
                  getDay(day).price &&
                  getDay(day).status === 'available'
                "
                class="text-caption"
              >
                {{ new Intl.NumberFormat().format(getDay(day).price) }}
              </p>
            </div>
          </template>
          <template #legends>
            <div class="my-1">
              <div class="d-flex align-center flex-wrap">
                <v-sheet
                  width="15"
                  height="15"
                  color="blue-grey lighten-3"
                  class="rounded-circle"
                ></v-sheet>
                <h6
                  class="mr-2 font-weight-regular direction-rtl text-subtitle-1"
                >
                  غیر قابل انتخاب
                </h6>
              </div>
            </div>
            <div class="my-1">
              <div class="d-flex align-center flex-wrap">
                <v-sheet
                  width="15"
                  height="15"
                  color="orange"
                  class="rounded-circle"
                ></v-sheet>
                <h6
                  class="mr-2 font-weight-regular direction-rtl text-subtitle-1"
                >
                  از قبل رزرو شده
                </h6>
              </div>
            </div>
          </template>
        </custom-date-picker>
      </template>
    </v-dialog>

    <v-snackbar v-model="showError" color="red" dark :timeout="3000">
      {{ errorText }}
    </v-snackbar>
  </div>
</template>
<script>
import CustomDatePicker from '~/components/CustomDatePicker.vue';
export default {
  components: {
    CustomDatePicker,
  },
  data() {
    return {
      date: [null, null],
      date2: [null, null],
      dates: [],
      range: true,
      showError: false,
      errorText: null,
      showCalendar: false,
    };
  },
  fetch() {
    // console.log(this.newDay().format('YYYY/MM/DD MMMM'));
    for (let i = 0; i < 100; i++) {
      let status = null;
      const statusArr = ['available', 'not-available'];
      if (i >= 10 && i <= 15) status = 'reserved';
      else status = Math.random() < 0.8 ? statusArr[0] : statusArr[1];
      const prices = [500, 1000, 2000];
      this.dates.push({
        date: this.$dayjs().add(i, 'd').format('YYYY/MM/DD'), // YYYY/MM/DD
        price: prices[Math.floor(Math.random() * 3)],
        offPercent: null, // numeric value for discount percentage... we don't show it in calendar yet
        package: null, // each package is object {id,title,fromDate,toDate,color} ... fromDate,toDate should be in Date api format
        status,
        // can be 'not-available' --> for any dates that not available(past dates or those future dates that place manager still not added them) ... reserved dates should have 'reserved' status
        // can be 'available' --> user can only select these days
        // can be 'reserved' --> for dates that are already reserved or even someone wants to reserver them but still not pay them
        isHoliday: false, // for holidays rather than friday ... only for change color and nothing to do with selecting day
        isLastMinute: false, // bool , we don't show it in calendar yet
      });
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    overlayWidth() {
      switch (this.isMobile) {
        case false:
          return '55%';
        default:
          return '100%';
      }
    },
    isAuth() {
      return this.$store.getters['auth/isAuth'];
    },
  },
  methods: {
    getDay(day) {
      return this.dates.find(d => d.date === day.dayFormat);
    },
    selectDay(d) {
      const day = this.dates.find(date => date.date === d.dayFormat);
      day.dayFormat = d.dayFormat;
      if (day && day.status === 'available') {
        if (!this.range) {
          this.date = day.dayFormat;
          this.showCalendar = false;
        } else if (
          (!this.date[0] && !this.date[1]) ||
          (this.date[0] && this.date[1])
        ) {
          this.date = [day.dayFormat, null];
        } else if (this.date[0] && !this.date[1]) {
          if (this.date[0] !== day.dayFormat) {
            const daysBetween = this.dates.filter(p => {
              return this.$dayjs(p.date, {
                jalali: true,
              }).isBetween(
                this.$dayjs(this.date[0], {
                  jalali: true,
                }),
                this.$dayjs(day.dayFormat, {
                  jalali: true,
                }),
                null,
                '[]'
              );
            });
            const deActiveDaysBetween = daysBetween.filter(
              d => d.status !== 'available'
            );
            if (deActiveDaysBetween.length) {
              this.showError = true;
              this.errorText = 'در بین تاریخ انتخابی روزهای غیر فعال وجود دارد';
            } else if (
              this.$dayjs(day.dayFormat, {
                jalali: true,
              }).isBefore(
                this.$dayjs(this.date[0], {
                  jalali: true,
                })
              )
            )
              this.date = [day.dayFormat, null];
            else {
              this.date = [this.date[0], day.dayFormat];
              this.showCalendar = false;
            }
          } else return null;
        }
      }
      return null;
    },
    dayCssClasses(day) {
      const target = this.dates.find(d => d.date === day.dayFormat);
      const monthStatus = day.monthStatus;
      const isNotAvailable = !target || target?.status === 'not-available';
      const isAvailable = target?.status === 'available' || false;
      const isReserved = target?.status === 'reserved' || false;
      const isHoliday = day.weekdayText === 6 || target?.isHoliday; // friday of holiday
      const isToday = this.$dayjs().format('YYYY/MM/DD') === day.dayFormat;
      // only for non-range mode
      const isSelected = !this.range && this.date === day.dayFormat;
      // only for range mode:
      const isFirstVal = this.range && this.date[0] === day.dayFormat;
      const isSecondVal = this.range && this.date[1] === day.dayFormat;
      const isBetween =
        this.range &&
        this.date[0] &&
        this.date[1] &&
        this.$dayjs(day.dayFormat, { jalali: true }).isBetween(
          this.$dayjs(this.date[0], { jalali: true }),
          this.$dayjs(this.date[1], { jalali: true })
        );
      // background-color -----------------------------
      // background-color -----------------------------
      // background-color -----------------------------
      let backgroundColor = null;
      if (monthStatus === 'prev' || monthStatus === 'next')
        backgroundColor = 'transparent';
      else if (isNotAvailable) backgroundColor = 'blue-grey lighten-3';
      else if (isReserved) backgroundColor = 'orange';
      else if (isSelected) backgroundColor = 'teal';
      else if (isFirstVal || isSecondVal) backgroundColor = 'teal';
      else if (isBetween) backgroundColor = `teal lighten-3`;
      else if (isToday) backgroundColor = 'success';
      else if (isAvailable) backgroundColor = 'transparent';
      // text-color -----------------------------
      // text-color -----------------------------
      // text-color -----------------------------
      let textColor = null;
      if (monthStatus === 'prev' || monthStatus === 'next')
        textColor = 'transparent--text';
      else if (isHoliday) textColor = `red--text`;
      else textColor = 'titleColor--text';
      // final css classes -------------------------
      // final css classes -------------------------
      // final css classes -------------------------
      const cssClasses = {
        [backgroundColor]: true,
        [textColor]: true,
        'cursor-pointer': isAvailable,
        'pointer-events-none': !isAvailable,
      };
      return cssClasses;
    },
  },
};
</script>

<style>
.back-img {
  background-image: url('/main.jpg');
  height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center center;
}
</style>
