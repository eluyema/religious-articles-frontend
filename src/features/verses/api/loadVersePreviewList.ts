import { VersePreview } from "@/features/verses/model/VersePreview";
import { getVersePreviewList } from "@/features/verses/api/staticVerseData";

export const loadVersePreviewList = async (): Promise<VersePreview[]> => {
    return getVersePreviewList();
};
