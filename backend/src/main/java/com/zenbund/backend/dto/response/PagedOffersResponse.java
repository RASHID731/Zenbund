package com.zenbund.backend.dto.response;

import java.util.List;

public class PagedOffersResponse {

    private List<OfferResponse> offers;
    private int currentPage;
    private int pageSize;
    private long totalOffers;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    // Constructors
    public PagedOffersResponse() {
    }

    public PagedOffersResponse(List<OfferResponse> offers, int currentPage, int pageSize,
                               long totalOffers, int totalPages, boolean hasNext, boolean hasPrevious) {
        this.offers = offers;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalOffers = totalOffers;
        this.totalPages = totalPages;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    // Getters and Setters
    public List<OfferResponse> getOffers() {
        return offers;
    }

    public void setOffers(List<OfferResponse> offers) {
        this.offers = offers;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public long getTotalOffers() {
        return totalOffers;
    }

    public void setTotalOffers(long totalOffers) {
        this.totalOffers = totalOffers;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
}
