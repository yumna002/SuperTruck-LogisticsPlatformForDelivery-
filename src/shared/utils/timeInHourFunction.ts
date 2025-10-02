export async function convertToHoursAndMinutes(timeInSeconds:number) {
    let hours = (Math.floor(timeInSeconds / 3600)).toString();
    if(hours.length==1)hours="0"+hours;
    let minutes = (Math.floor((timeInSeconds % 3600) / 60)).toString();  
    if(minutes.length==1)minutes="0"+minutes;

    const time=hours+":"+minutes;

    return time;
}
