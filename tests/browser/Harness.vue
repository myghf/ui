<script setup lang="ts">
import { ref } from 'vue'
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  BarChart,
  Breadcrumbs,
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FileUpload,
  FormField,
  Inline,
  Input,
  InputNumber,
  Label,
  PageContent,
  PageHeader,
  Popover,
  Progress,
  RadioGroup,
  Select,
  SelectButton,
  Sparkline,
  Spinner,
  StatCard,
  StatusBadge,
  Stepper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Textarea,
  TimePicker,
  Timeline,
  TimelineItem,
  Tooltip,
} from '@myghf/ui'

const checked = ref(true)
const switched = ref(true)
const radio = ref('a')
const segmented = ref('a')
const tab = ref('one')
const accordion = ref('a')
const picked = ref('')
const combobox = ref('')
const text = ref('')
const number = ref(3)
const date = ref<Date | null>(null)
const time = ref<string | null>('09:30')
const files = ref<File[]>([])
const page = ref(0)

const selectOptions = [
  { label: 'Cardiology', value: 'cardio' },
  { label: 'Neurology', value: 'neuro' },
]
const radioOptions = [
  { label: 'Low', value: 'a' },
  { label: 'Normal', value: 'b' },
]
const bars = [
  { label: 'Cardiology', value: 42 },
  { label: 'Neurology', value: 28 },
  { label: 'Oncology', value: 35 },
]
</script>

<template>
  <main aria-label="Component harness" class="min-h-screen bg-background p-6 font-sans text-foreground">
    <div class="mx-auto grid max-w-4xl gap-8">
      <PageHeader title="Component harness" description="Every component, in one page." />

      <p data-contrast-probe class="text-foreground">Body text on the page background.</p>

      <Inline gap="sm">
        <span data-token-probe class="rounded bg-primary-500 px-2 py-1 text-xs text-foreground">token probe</span>
        <span data-surface-probe class="rounded bg-surface px-2 py-1 text-xs text-foreground">surface probe</span>
      </Inline>

      <Stack gap="md">
        <Inline gap="sm">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="icon" icon="plus" aria-label="Add record" />
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
        </Inline>

        <Inline gap="sm">
          <Tag tone="secondary">Secondary</Tag>
          <Tag tone="info">Info</Tag>
          <Tag tone="success">Success</Tag>
          <Tag tone="warning">Warning</Tag>
          <Tag tone="danger">Danger</Tag>
          <Tag tone="success" removable>Removable</Tag>
        </Inline>

        <Stack gap="sm">
          <Alert tone="info" title="Info" description="Informational message." />
          <Alert tone="success" title="Success" description="Operation completed." />
          <Alert tone="warning" title="Warning" description="Check the dosage." closable />
          <Alert tone="danger" title="Error" description="Something went wrong." closable />
        </Stack>

        <Inline gap="md" align="center">
          <Spinner label="Loading results" />
          <Skeleton width="6rem" height="1rem" />
          <Avatar name="Amina Farouk" />
          <StatusBadge tone="success" label="Stable" />
          <StatusBadge tone="danger" label="Critical" pulse />
        </Inline>

        <Progress :model-value="60" label="Upload progress" />
        <Progress label="Loading" />
      </Stack>

      <Stack gap="lg">
        <FormField label="Patient name" description="As written on the file." required>
          <Input v-model="text" placeholder="Amina Farouk" />
        </FormField>

        <FormField label="Email" error="Enter a valid email address">
          <Input v-model="text" type="email" />
        </FormField>

        <FormField label="Unit">
          <Select v-model="picked" :options="selectOptions" placeholder="Pick a unit" clearable />
        </FormField>

        <FormField label="Notes">
          <Textarea v-model="text" placeholder="Clinical notes" />
        </FormField>

        <FormField label="Amount">
          <InputNumber v-model="number" :min="0" :max="10" show-buttons />
        </FormField>

        <FormField label="Search units">
          <Combobox v-model="combobox" :options="selectOptions" placeholder="Search" clearable />
        </FormField>

        <FormField label="Admission date">
          <DatePicker v-model="date" />
        </FormField>

        <FormField label="Appointment time">
          <TimePicker v-model="time" hour-format="12" :minute-step="15" />
        </FormField>

        <FormField label="Documents">
          <FileUpload v-model="files" multiple />
        </FormField>

        <label class="flex items-center gap-2 text-sm">
          <Checkbox v-model="checked" />
          Accept the terms
        </label>

        <label class="flex items-center gap-2 text-sm">
          <Switch v-model="switched" />
          Enable alerts
        </label>

        <RadioGroup v-model="radio" :options="radioOptions" />
        <SelectButton v-model="segmented" :options="radioOptions" />

        <p class="text-sm text-muted">A disabled control below.</p>
        <Label for="harness-disabled">Disabled input</Label>
        <Input id="harness-disabled" v-model="text" disabled />
      </Stack>

      <Tabs v-model="tab">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>

      <Accordion v-model="accordion">
        <AccordionItem value="a" title="Clinical notes" :heading-level="2">
          Progress notes for the admission.
        </AccordionItem>
        <AccordionItem value="b" title="Lab results" :heading-level="2">
          Latest bloods and imaging.
        </AccordionItem>
      </Accordion>

      <Inline gap="sm">
        <Tooltip text="Saves and closes"><Button size="sm">Save</Button></Tooltip>
        <Popover>
          <template #trigger><Button size="sm" variant="outline">Filters</Button></template>
          <p class="text-sm text-muted">Filter the records here.</p>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="sm" variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Inline>

      <Breadcrumbs :items="[{ label: 'Patients', href: '#' }, { label: 'Amina Farouk' }]" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Amina Farouk</TableCell>
            <TableCell>Cardiology</TableCell>
          </TableRow>
          <TableEmpty v-if="false" :columns="2">No results</TableEmpty>
        </TableBody>
      </Table>

      <TablePagination v-model:page-index="page" :page-size="10" :total="35" />

      <Inline gap="lg" align="center">
        <Sparkline :data="[4, 6, 5, 9, 7, 11]" label="Median wait times" />
        <BarChart :data="bars" label="Referrals by unit" :width="260" :height="120" />
      </Inline>

      <Inline gap="md">
        <StatCard label="Admissions" :value="128" hint="This month" :trend="12" />
        <StatCard label="Avg. wait" value="3.4 d" :trend="-5" />
      </Inline>

      <Stepper :model-value="1" :steps="[{ label: 'Details' }, { label: 'Payment' }, { label: 'Review' }]" />

      <Timeline label="Admission">
        <TimelineItem title="Admitted" time="09:15" tone="success">Triage complete.</TimelineItem>
        <TimelineItem title="Transferred to ward" time="11:40">Bed 12 assigned.</TimelineItem>
      </Timeline>

      <PageContent size="md">
        <p class="text-sm text-muted">Page body content.</p>
      </PageContent>
    </div>
  </main>
</template>
