export function generateICS(event: {
    title: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
}) {
    const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Remedy//Rezervace//CZ
BEGIN:VEVENT
UID:${Date.now()}@remedy.cz
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location || 'REMEDY, Praha'}
END:VEVENT
END:VCALENDAR`;
}

export function generateGoogleCalendarLink(event: {
    title: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
}) {
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        details: event.description,
        dates: `${formatDate(event.start)}/${formatDate(event.end)}`,
        location: event.location || 'REMEDY, Praha'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
