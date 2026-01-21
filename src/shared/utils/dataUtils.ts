import { Page } from "@/shared/api/models/common";
import { BaseSchema, ResId } from "@/shared/api/models/commonNative";
import { AnyPredicate } from "@/shared/types/genericTypes";
import { InfiniteData } from "@tanstack/react-query";

export interface HasId { id?: ResId }

type PagePredicate = <T extends HasId>(page: Page<T>, entityId: ResId) => boolean;

type PageTransformer = <T extends HasId>(page: Page<T>, entityId: ResId, entity?: T) => Page<T>;

/**
 * Checks if the given entity matches the specified entity ID.
 *
 * @param {T extends BaseSchema} entity - The entity to check.
 * @param {string} entityId - The ID to match against.
 * @returns {boolean} - True if the entity matches the ID; otherwise, false.
 */
export const isMatchingEntity = <T extends BaseSchema>(entity: T, entityId: string): boolean => {
    return entity.id === entityId;
};

/**
 * Checks if the given entity does not match the specified entity ID.
 *
 * @param {T extends HasId} entity - The entity to check.
 * @param {ResId} entityId - The ID to match against.
 * @returns {boolean} - True if the entity does not match the ID; otherwise, false.
 */
export const isNotMatchingById = <T extends HasId>(entity: T, entityId: ResId): boolean => {
    return entity.id !== entityId;
};

/**
 * Checks if the given entity matches the specified entity ID.
 *
 * @param {T extends HasId} entity - The entity to check.
 * @param {ResId} entityId - The ID to match against.
 * @returns {boolean} - True if the entity matches the ID; otherwise, false.
 */
export const isMatchingById = <T extends HasId>(entity: T, entityId: ResId): boolean => {
    return entity.id === entityId;
};

/**
 * Filters the page content by removing the entity with the specified ID.
 *
 * @param {Page<T>} page - The page containing content to filter.
 * @param {ResId} entityId - The ID of the entity to remove.
 * @returns {Page<T>} - The updated page with the entity removed from content.
 */
export const filterPageContentById = <T extends HasId>(page: Page<T>, entityId: ResId): Page<T> => {
    return { ...page, content: page.content.filter(entity => isNotMatchingById(entity, entityId)) };
};

/**
 * Checks if the page includes an entity with the specified ID.
 *
 * @param {Page<T>} page - The page to check.
 * @param {ResId} entityId - The ID to check for.
 * @returns {boolean} - True if the page includes the entity; otherwise, false.
 */
export const isPageIncludesEntity: PagePredicate = (page, entityId) => {
    return page.content.some(entity => entity.id === entityId);
};

/**
 * Checks if the page number matches the specified number.
 *
 * @param {Page<T>} page - The page to check.
 * @param {number} number - The number to match against.
 * @returns {boolean} - True if the page number matches; otherwise, false.
 */
export const isPageMatchesByNumber: PagePredicate = (page, number) => {
    return page.number === number;
};

/**
 * Transforms infinite pages by applying a transformer function to a specific page identified by a predicate.
 *
 * @param {InfiniteData<Page<T>>} data - The infinite data containing pages.
 * @param {ResId} entityId - The ID of the entity to match.
 * @param {PagePredicate} pagePredicate - The predicate to find the matching page.
 * @param {PageTransformer} transformer - The transformation function to apply.
 * @param {T} [entity] - An optional entity to use in the transformation.
 * @returns {InfiniteData<Page<T>>} - The updated infinite data with transformed pages.
 * @throws {Error} - Throws an error if no matching page is found.
 */
export const transformInfinetePages = <T extends HasId>(
    data: InfiniteData<Page<T>>,
    entityId: ResId,
    pagePredicate: PagePredicate,
    transformer: PageTransformer,
    entity?: T
): InfiniteData<Page<T>> => {
    const pageIndex = data.pages.findIndex(page => pagePredicate(page, entityId));

    if (pageIndex === -1) throw new Error("page not found");

    const updatedPages = data.pages.map((page, index) =>
        index === pageIndex ?
            transformer(page, entityId, entity) : page
    );

    return { ...data, pages: updatedPages };
};

/**
 * Marks the content of a specific entity as seen.
 *
 * @param {Page<T>} page - The page containing the content.
 * @param {ResId} entityId - The ID of the entity to mark as seen.
 * @returns {Page<T>} - The updated page with the entity marked as seen.
 */
export const setEntityContentSeen: PageTransformer = <T extends HasId>(
    page: Page<T>,
    entityId: ResId
): Page<T> => ({
    ...page,
    content: page.content.map(entity => {
        if (entity.id !== entityId) return entity;
        return { ...entity, isSeen: true } as T;
    })
});

/**
 * Updates the content of a specific entity in the page.
 *
 * @param {Page<T>} page - The page containing the content.
 * @param {ResId} entityId - The ID of the entity to update.
 * @param {T} [entity] - The new entity data to replace the old one.
 * @returns {Page<T>} - The updated page with the entity content replaced.
 */
export const updateEntityContent: PageTransformer = <T extends HasId>(
    page: Page<T>,
    entityId: ResId,
    entity?: T
): Page<T> => ({
    ...page,
    content: page.content.map((foundEntity) =>
        foundEntity.id !== entityId ? foundEntity : (entity ?? foundEntity)
    ),
});

/**
 * Pushes a new entity to the content of the specified page.
 *
 * @param {InfiniteData<Page<T>>} data - The infinite data containing pages.
 * @param {T} entity - The new entity to add.
 * @param {AnyPredicate} pagePredicate - The predicate to identify the target page.
 * @returns {InfiniteData<Page<T>>} - The updated infinite data with the new entity added.
 * @throws {Error} - Throws an error if no matching page is found.
 */
export const pushToPageContent = <T extends HasId>(
    data: InfiniteData<Page<T>>,
    entity: T,
    pagePredicate: AnyPredicate,
): InfiniteData<Page<T>> => {
    const pageIndex = data.pages.findIndex(pagePredicate);

    if (pageIndex === -1) throw new Error("page not found");

    const updatedPages = data.pages.map((page, index) =>
        index === pageIndex
            ? { ...page, content: [entity, ...page.content] }
            : page
    );

    return { ...data, pages: updatedPages };
};

/**
 * Formats photo data into a base64 encoded string for display.
 *
 * @param {string} type - The MIME type of the image (e.g., "image/png").
 * @param {string} data - The base64 data string of the image.
 * @returns {string} - The formatted data URL for the image.
 */
export const formatPhotoData = (type: string, data: string) => `data:${type};base64,${data}`;