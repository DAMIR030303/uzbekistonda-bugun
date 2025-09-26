# DATA CONTRACTS — supabase-ga bog'lanmagan interfeyslar

> Maqsad: Frontend/Edge qismlari Supabase’dan mustaqil ishlashi uchun **qatlamlararo shartnoma** (contract)larni aniqlab qo'yamiz.
> Implementatsiya (Supabase yoki muqobil) keyin alohida adaptor bilan yoziladi.

## Entitilar va maydonlar
### `Org`
- `id: uuid`
- `name: string`
- `slug: string`

### `Branch`
- `id: uuid`
- `org_id: uuid`
- `name: string`
- `slug: 'navoiy' | 'samarqand' | 'toshkent' | string`
- `theme: { primary: string, gradient?: string }`

### `UserProfile`
- `id: uuid`
- `auth_user_id: uuid`
- `org_id: uuid`
- `branch_id: uuid`
- `role: 'super_admin' | 'admin' | 'pm' | 'ssenarist' | 'dizayner' | 'smm' | 'operator' | 'viewer'`

### `Plan`
- `id: uuid`
- `branch_id: uuid`
- `title: string`
- `week_start: YYYY-MM-DD` (Dushanba)
- `meta?: json`

### `Task`
- `id: uuid`
- `plan_id: uuid`
- `starts_at: ISO 8601 tz`
- `ends_at: ISO 8601 tz`
- `title: string`
- `notes?: string`
- `assignee_id?: uuid`
- `status: 'taken' | 'done' | 'posted' | 'edited'`
- `created_at`, `updated_at`

### `ClientCard`
- `task_id: uuid`
- `brand: string`
- `full_name?: string`
- `phone?: E.164 string`
- `ad_type?: string[]`
- `scenario?: string`
- `remarks?: string`

### `StatusHistory`
- `id: uuid`
- `task_id: uuid`
- `status: 'taken' | 'done' | 'posted' | 'edited'`
- `at: ISO 8601 tz`
- `by: uuid (user_profile.id)`

### `Attachment`
- `id: uuid`
- `task_id: uuid`
- `file_path: string` (S3-compatible path)
- `type: string` (mime)
- `size: number`
- `meta?: json`

### `AuditLog`
- `id: uuid`
- `actor: uuid`
- `action: string`
- `table: string`
- `record_id: string|uuid`
- `old?: json`
- `new?: json`
- `at: ISO 8601 tz`

## Operatsiyalar (ports)
### Plans
- `listPlans(branch_id, {limit?, offset?, from_date?}): Plan[]`
- `getPlan(plan_id): Plan & { tasks: Task[] }`
- `createPlan(payload): Plan`
- `archivePlan(plan_id): void`

### Tasks
- `createTask(plan_id, payload): Task`
- `updateTask(task_id, payload): Task`
- `deleteTask(task_id): void`
- `listStatusHistory(task_id): StatusHistory[]`

### ClientCard
- `upsertClientCard(task_id, payload): ClientCard`

### Attachments
- `signUpload(task_id, filename, contentType): { signedUrl, path }`
- `linkAttachment(task_id, { path, type, size, meta? }): Attachment`
- `listAttachments(task_id): Attachment[]`
- `deleteAttachment(attachment_id): void`

### Realtime
- `subscribe(channel, handler)` — kanallar: `branch:{id}`, `plan:{id}`
- Eventlar: `plan.updated`, `task.created`, `task.updated`, `status.changed`, `attachment.added`

## JSON namunalar
### Task (create)
```json
{
  "plan_id": "uuid",
  "starts_at": "2025-09-08T09:00:00+05:00",
  "ends_at": "2025-09-08T09:30:00+05:00",
  "title": "Instagram Promo",
  "notes": "Stories + Post",
  "assignee_id": "uuid"
}
```
### Status History (event)
```json
{ "task_id":"uuid","status":"done","at":"2025-09-08T10:05:10+05:00","by":"uuid" }
```
