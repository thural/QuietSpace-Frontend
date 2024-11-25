import { Page } from "@/api/schemas/inferred/common";
import { BaseSchema, ResId } from "@/api/schemas/native/common";
import { AnyPredicate } from "@/types/genericTypes";
import { InfiniteData } from "@tanstack/react-query";
import { nullishValidationdError } from "./errorUtils";

export interface HasId { id: ResId }

type PagePredicate = <T extends HasId>(page: Page<T>, entityId: ResId) => boolean;

type PageTransformer = <T extends HasId>(page: Page<T>, entityId: ResId) => Page<T>;

export const isMatchingEntity = <T extends BaseSchema>(entity: T, entityId: string): boolean => {
    return entity.id === entityId;
};

export const isNotMatchingById = <T extends HasId>(entity: T, entityId: ResId): boolean => {
    return entity.id !== entityId;
};

export const isMatchingById = <T extends HasId>(entity: T, entityId: ResId): boolean => {
    return entity.id === entityId;
};

export const filterPageContentById = <T extends HasId>(page: Page<T>, entityId: ResId): Page<T> => {
    return { ...page, content: page.content.filter(entity => isNotMatchingById(entity, entityId)) };
}

export const isPageIncludesEntity: PagePredicate = (page, entityId) => {
    return page.content.some(entity => entity.id === entityId)
};

export const isPageMatchesByNumber: PagePredicate = (page, number) => {
    return page.number === number;
};

export const transformInfinetePages = <T extends HasId>(
    data: InfiniteData<Page<T>>,
    entityId: ResId,
    pagePredicate: PagePredicate,
    transformer: PageTransformer
): InfiniteData<Page<T>> => {
    const pageIndex = data.pages.findIndex(page => pagePredicate(page, entityId));

    if (pageIndex === -1) throw nullishValidationdError({ lastPage: null });

    const updatedPages = data.pages.map((page, index) =>
        index === pageIndex
            ? transformer(page, entityId) : page
    );

    return { ...data, pages: updatedPages };
};

export const setMessageContentSeen: PageTransformer = <T extends HasId>(
    page: Page<T>,
    messageId: ResId
): Page<T> => ({
    ...page,
    content: page.content.map(message => {
        if (message.id !== messageId) return message;
        return { ...message, isSeen: true } as T;
    })
});

export const pushToPageContent = <T extends HasId>(
    data: InfiniteData<Page<T>>,
    entity: T,
    pagePredicate: AnyPredicate,
): InfiniteData<Page<T>> => {
    const pageIndex = data.pages.findIndex(pagePredicate);

    if (pageIndex === -1) throw nullishValidationdError({ lastPage: null });

    const updatedPages = data.pages.map((page, index) =>
        index === pageIndex
            ? { ...page, content: [entity, ...page.content] }
            : page
    );

    return { ...data, pages: updatedPages };
}