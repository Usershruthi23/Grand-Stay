package com.example.hotelbooking.dto;

public class AdminDashboardResponse {

    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long todayCheckIns;
    private long todayCheckOuts;
    private long currentGuests;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(long totalRooms, long availableRooms, long occupiedRooms,
                                  long todayCheckIns, long todayCheckOuts, long currentGuests) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.todayCheckIns = todayCheckIns;
        this.todayCheckOuts = todayCheckOuts;
        this.currentGuests = currentGuests;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(long occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }

    public long getTodayCheckIns() {
        return todayCheckIns;
    }

    public void setTodayCheckIns(long todayCheckIns) {
        this.todayCheckIns = todayCheckIns;
    }

    public long getTodayCheckOuts() {
        return todayCheckOuts;
    }

    public void setTodayCheckOuts(long todayCheckOuts) {
        this.todayCheckOuts = todayCheckOuts;
    }

    public long getCurrentGuests() {
        return currentGuests;
    }

    public void setCurrentGuests(long currentGuests) {
        this.currentGuests = currentGuests;
    }
}
