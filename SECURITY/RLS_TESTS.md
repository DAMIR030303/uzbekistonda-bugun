# SECURITY — RLS test matritsasi

## Operatsiyalar
- Plan: read/create/update/delete
- Task: read/create/update/delete
- StatusHistory: read/append
- Attachment: sign/list/delete
- AuditLog: read (faqat admin/super_admin)

## Rollar × Amal (filial doirasida)
| Rol           | Plan R | Plan C | Plan U | Plan D | Task R | Task C | Task U | Task D | History Read | History Append |
|---------------|--------|--------|--------|--------|--------|--------|--------|--------|--------------|----------------|
| viewer        | ✅     | ❌     | ❌     | ❌     | ✅     | ❌     | ❌     | ❌     | ✅           | ❌             |
| operator/smm  | ✅     | ✅     | ✅     | ❌     | ✅     | ✅     | ✅     | ❌     | ✅           | ✅             |
| ssenarist/diz | ✅     | ✅     | ✅     | ❌     | ✅     | ✅     | ✅     | ❌     | ✅           | ✅             |
| pm/admin      | ✅     | ✅     | ✅     | ✅     | ✅     | ✅     | ✅     | ✅     | ✅           | ✅             |
| super_admin   | ✅ all filiallar bo'yicha                                                                                     |

## Manfiy testlar
- Boshqa filial `branch_id` yozuvini o‘qish/yozish → ❌
- `service_role` kaliti brauzerda ishlatilsa → ❌
- Storage public read → ❌
- `status.update`ni viewer bajarishi → ❌

## Sinov usuli
- Playwright: UI orqali CRUD oqimlari
- Postman/HTTP: Edge endpointlar (`API/EDGE_HTTP_CONTRACTS.md`)
- SQL: policy-larni `USING/WITH CHECK` tekshirish uchun `EXPLAIN` hamda test user’lar bilan query
