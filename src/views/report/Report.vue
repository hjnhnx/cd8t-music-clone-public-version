<template>
  <BasePageHeader />
  <BaseMain>
    <h2 class="text-3xl font-bold text-gray-800">Song Top</h2>
    <div class="text-gray-600">Top songs with the highest views</div>
    <div class="mt-4 bg-white p-6">
      <Spin :spinning="loadingLineChart">
        <LineChart :chartData="lineData" class="mt-4" />
      </Spin>
    </div>

    <h2 class="mt-16 text-3xl font-bold">Top Package</h2>
    <div class="text-gray-600">Top best selling packages</div>
    <div class="mt-4 bg-white p-6">
      <Spin :spinning="loadingBarChart">
        <BarChart :chartData="barData" class="mt-4" />
      </Spin>
    </div>

    <h2 class="mt-16 text-3xl font-bold">Top Package</h2>
    <div class="text-gray-600">Package for date</div>
    <div class="mt-4 bg-white p-6">
      <Spin :spinning="loadingBarChart">
        <div class="flex gap-x-8">
          <div class="flex items-center gap-x-2">
            <div>Time period:</div>
            <RangePicker
                v-model:value="day"
                :format="DISPLAY_DATE_FORMAT"
                :ranges="presetRanges"
            />
          </div>
          <Button type="primary" @click="changeDate">Submit</Button>
        </div>
        <BarChart :chartData="barDataA" class="mt-4" />
      </Spin>
    </div>

    <h2 class="mt-16 text-3xl font-bold">Star Point</h2>
    <div class="text-gray-600">Top StarPoint by year</div>
    <div class="mt-4 bg-white p-6">
      <Spin :spinning="loadingBarChart">
        <div class="flex gap-x-4">
          <div class="flex items-center gap-x-2">
            <div>Time period:</div>
            <DatePicker v-model:value="yearStarPoint"  picker="year" />
          </div>
          <Button @click="changeYear" type="primary">Submit</Button>
        </div>
        <LineChart :chartData="starPointData" class="mt-4" />
      </Spin>
    </div>
  </BaseMain>
</template>

<script lang="ts" setup>
import { BarChart, LineChart } from "vue-chart-3";
import { RangePicker, Button, notification, Spin, DatePicker } from "ant-design-vue";
import { Chart, registerables } from "chart.js";
import { BaseMain, BasePageHeader } from "@/components";
import { onMounted, ref } from "vue";
import type {ReportRequest, ReportStarPointRequest} from "@/types/models";
import { DashboardService } from "@/services/dashboard";
import dayjs, { Dayjs } from "dayjs";
import { DISPLAY_DATE_FORMAT, DB_DATE_FORMAT, DB_MONTH_FORMAT } from "@/utils/constants";


type RangeValue = [Dayjs, Dayjs];
type YearValue = Dayjs;

Chart.register(...registerables);

const timeParams = ref<ReportRequest>({
  startTime: undefined,
  endTime: undefined,
});
const timeParamsPackageA = ref<ReportRequest>({
  size: undefined
});
const year = ref<ReportStarPointRequest>({
  year: undefined,
});
const loadingLineChart = ref<boolean>(false);
const day = ref<RangeValue>([dayjs().startOf("month"), dayjs().endOf('month')]);
const month = ref<RangeValue>([dayjs().startOf("year"), dayjs()]);
const yearStarPoint = ref<YearValue>(dayjs().startOf("year"));
const presetRanges = {
  "This month": [dayjs().startOf("month"), dayjs()] as RangeValue,
  "Last month": [dayjs().startOf("month").add(-1, "month"), dayjs().endOf("month").add(-1, "month")] as RangeValue,
  "Last 30 days": [dayjs().add(-30, "day"), dayjs()] as RangeValue,
};

const labelsByTime = ref<string[]>([]);
const dataByTime = ref<number[]>([]);
const lineData = ref({
  labels: [],
  datasets: [
    {
      label: "Song",
      data: [],
      backgroundColor: "#42cef5",
      tension: 0.3,
    },
  ],
});
const starPointData = ref({
  labels: [],
  datasets: [
    {
      label: "Star point",
      data: [],
      backgroundColor: "#42cef5",
      tension: 0.3,
    },
  ],
});
const staticSong = async () => {
  loadingLineChart.value = true;
  await DashboardService.staticSong().then(({ data }) => {
    lineData.value.labels = Array.from(data.data.map((e: any) => e["name"]))
    lineData.value.datasets[0].data = Array.from(data.data.map((e: any) => e["view"]))
  });
  loadingLineChart.value = false;
};
const staticPackage = async () => {
  loadingLineChart.value = true;
  timeParamsPackageA.value.size = "1"
  await DashboardService.staticPackage(timeParamsPackageA.value).then(({ data }) => {
    barData.value.labels = Array.from(data.data.map((e: any) => e["name"]))
    barData.value.datasets[0].data = Array.from(data.data.map((e: any) => e["sold"]))
  });

  loadingLineChart.value = false;
};
const changeYear = async () => {
  year.value.year = yearStarPoint.value.get('year').toString()
  await staticStarPoint();
};
const changeDate = async () => {
  timeParams.value.startTime = day.value[0].format(DB_DATE_FORMAT);
  timeParams.value.endTime = day.value[1].format(DB_DATE_FORMAT);
  await staticPackageA();
};

const staticStarPoint = async () => {
  loadingLineChart.value = true;
  await DashboardService.staticStarPoint(year.value).then(({ data }) => {
    starPointData.value.labels = Array.from(data.data.map((e: any) => `month ${e["month"]}`))
    starPointData.value.datasets[0].data = Array.from(data.data.map((e: any) => e["starPoint"]))
  });

  loadingLineChart.value = false;
};
const staticPackageA = async () => {
  loadingLineChart.value = true;
  await DashboardService.staticPackageA(timeParams.value).then(({ data }) => {
    barDataA.value.labels = Array.from(data.data.map((e: any) => e["name"]))
    barDataA.value.datasets[0].data = Array.from(data.data.map((e: any) => e["sold"]))
  });
  loadingLineChart.value = false;
};




const loadingBarChart = ref<boolean>(false);
const barData = ref({
  labels: [],
  datasets: [
    {
      label: "Submissions",
      data: [],
      backgroundColor: "#97B0C4",
    },
  ],
});
const barDataA = ref({
  labels: [],
  datasets: [
    {
      label: "Submissions",
      data: [],
      backgroundColor: "#97B0C4",
    },
  ],
});

onMounted(async () => {
  timeParams.value.startTime = day.value[0].format(DB_DATE_FORMAT);
  timeParams.value.endTime = day.value[1].format(DB_DATE_FORMAT);
  year.value.year = yearStarPoint.value.get('year').toString()
  await staticPackage();
  await staticStarPoint();
  await staticSong();
  await staticPackageA();
});
</script>

<style scoped></style>
