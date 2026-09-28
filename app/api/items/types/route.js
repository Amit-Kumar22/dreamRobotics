import { ITEM_TYPES } from '@/models/Item';
import { ok } from '@/lib/http';

// GET /api/items/types -> allowed item types
export function GET() {
  return ok({ data: ITEM_TYPES });
}
