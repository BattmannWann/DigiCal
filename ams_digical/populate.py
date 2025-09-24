import os 
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'ams_digical.settings')

import django
django.setup()
from digical.models.staff_models import *
from digical.models.models import *
from digical.models.event_models import *

from django.contrib.auth.models import User
from datetime import date # for DateField
from phonenumber_field.phonenumber import PhoneNumber

def populate():
    # create list of dict containing items
    # create a dictionary of dictionaries for categories

    machine = [
        {   'machine_name': 'Woolwich',
            'last_maintenance': date(2024, 10, 1),
            'status': 'Online',
            'description': '',
            'batches_processed': 8 },
        {   'machine_name': 'Vickers',
            'last_maintenance': date(2024, 12, 1),
            'status': 'Processing',
            'description': '',
            'batches_processed': 3 },
        {   'machine_name': 'Armstrong',
            'last_maintenance': date(2024, 11, 15),
            'status': 'Error',
            'description': '',
            'batches_processed': 5 }
    ]

    # status should be a choice field

    staff = [
        {
            'username': 'LMS_WS',
            'first_name': 'William',
            'last_name': 'Stanier',
            'email': 'dummy1@dummyaddress',
            'phone': PhoneNumber.from_string("1234 567890", region = 'GB'), # +44 1234 567890 
            'post': Staff.Post.MANAGER,
            'status': Staff.StaffStatus.HOLIDAY
        },
        {
            'username': 'LNER_NG',
            'first_name': 'Nigel',
            'last_name': 'Gresley',
            'email': 'dummy2@dummyaddress',
            'phone': PhoneNumber.from_string("1234 567890", region = 'GB'), # +44 1234 567890
            'post': Staff.Post.MANAGER,
            'status': Staff.StaffStatus.WFH
        },
        {
            'username': 'LNER_DH',
            'first_name': 'Richard',
            'last_name': 'Hardy',
            'email': 'dummy3@dummyaddress',
            'phone': PhoneNumber.from_string("1234 567890", region = 'GB'), # +44 1234 567890
            'post': Staff.Post.STAFF,
            'status': Staff.StaffStatus.LEAVE
        },
        {
            'username': 'NBL_NR&C',
            'first_name': 'Neilson',
            'last_name': 'Reid',
            'email': 'dummy4@dummyaddress',
            'phone': PhoneNumber.from_string("1234 567890", region = 'GB'), # +44 1234 567890
            'post': Staff.Post.CONTRACTOR,
            'status': Staff.StaffStatus.OFFICE
        }
    ]

    ## we might want to make SubmitterLab and Radionuclide a choice field?

    submitter_lab = [
        {   'name': 'NRCL',
            'description': 'NRCL'
        },
        {   'name': 'SUERC 14C',
            'description': 'SUERC Radiocarbon'
        },
        {
            'name': 'SUERC Cosmo',
            'description': 'SUERC Cosmogenic Nuclides'
        },
        {
            'name': 'Edi Cosmo',
            'description' : 'Uni of Edinburgh Cosmogenic Nuclide Laboratory'
        }
    ]

    radionuclide = [
        {   'name': '14C',
            'description': 'Radiocarbon'
        },
        {
            'name': '10Be',
            'description': 'Beryilium'
        },
        {
            'name': '26Al',
            'description': 'Aluminium'
        },
        {
            'name': '36Cl',
            'description': 'Chlorine'
        },
        {
            'name': '129I',
            'description': 'Iodine'
        },
        {
            'name': 'Ex1',
            'description': 'Extra 1 - See Details'
        },
        {
            'name': 'Ex2',
            'description': 'Extra 2 - See Details'
        }
    ]

    batch = [
        {
            'title' : 'EdiCos 129I 1',
            'full_name' : 'Edi Cosmo Iodine Sample 1',
            'whiteboard_name' : 'EdiCos 129I 1',

            'date_batch_submitted' : date(2025, 2, 5),
            'scheduled_start' : date(2025, 2, 10),
            'report_sent' : date(2025, 2, 20),

            'submitter_lab' : 'Edi Cosmo',
            'number_of_samples' : 3,
            'radionuclide' : '129I',
            'source' : 'Woolwich',

            'comment' : '',
            'approved_by' : 'LNER_NG'
        },
    ]

    events = [
        {
            'title' : 'EdiCos 129I 1',
            'description' : 'Edi Cosmo Iodine Sample 1',

            'event_type' : BatchProcessingEvent,
            'responsible_staff' : 'LNER_NG',
            'asso_machine' : 'Woolwich',
            'asso_batch': 'EdiCos 129I 1',

            'start' : date(2025, 2, 5),
            'end' : date(2025, 2, 17),
        },
        {
            'title' : 'WS Absence',
            # 'description' : 'Holiday',
            'event_type' : StaffAwayEvent,
            'responsible_staff' : 'LMS_WS',
            'start' : date(2025, 2, 9),
            'end' : date(2025, 2, 15)
        },
        {
            'title' : 'NG WFH',
            'description' : 'WFH',
            'event_type' : StaffAwayEvent,
            'responsible_staff' : 'LNER_NG',
            'start' : date(2025, 2, 13),
            'end' : date(2025, 2, 14)
        },
        {
            'title' : 'Vickers Failed',
            'description' : 'Vickers Failure',
            'event_type' : MaintenanceEvent,
            'responsible_staff' : 'NBL_NR&C',
            'asso_machine' : 'Vickers',
            'start' : date(2025, 2, 11),
            'report_date' : date(2025, 2, 11),
            # 'scheduled_date' : date(2025, 2, 12), # Failed machine isn't scheduled for repairs
            'scheduled' : False,
            'status' : MaintenanceEvent.MaintenanceStatus.PENDING
        },
        {
            'title' : 'Woolwich Maintenance',
            'description' : 'Woolwich Planned Maintenenance',
            'event_type' : MaintenanceEvent,
            'responsible_staff' : 'NBL_NR&C',
            'asso_machine' : 'Woolwich',
            'start' : date(2025, 2, 24),
            'end' : date(2025, 2, 28),
            # 'report_date' : date(2025, 2, 11), # Scheduled Maintenance isn't reported
            'scheduled_date' : date(2025, 2, 24),
            'scheduled' : True,
            'status' : MaintenanceEvent.MaintenanceStatus.PENDING
        }
    ]

    cats = {
        Machine : machine,
        Staff : staff,
        SubmitterLab : submitter_lab,
        Radionuclide : radionuclide,
        Batch : batch,
        Event : events,
    }

    for cat, cat_data in cats.items():
        for cd in cat_data:
            if cat == Machine:
                m, created = Machine.objects.get_or_create(
                        machine_name = cd['machine_name'],
                        last_maintenance = cd['last_maintenance'],
                        status = cd['status'],
                        description = cd['description'],
                        batches_processed = cd['batches_processed']
                    )
                
            if cat == Staff:
                u, created = User.objects.get_or_create(
                    username = cd['username'],
                    email = cd['email'],
                    first_name = cd['first_name'],
                    last_name = cd['last_name']
                )
                
                s, created = Staff.objects.get_or_create(user = u)
                s.staff_name = cd['first_name'] + "_" + cd['last_name']
                s.phone = cd['phone']
                s.post = cd['post']
                s.status = cd['status']
                s.save()

            if cat == SubmitterLab:
                sl, created = SubmitterLab.objects.get_or_create(name = cd['name'])
                sl.description = cd['name']
                sl.save()

            if cat == Radionuclide:
                rn, created = Radionuclide.objects.get_or_create(name = cd['name'])
                
                if rn.description != cd['description']:
                    rn.description = cd['description']
                    rn.save()

            if cat == Batch:
                approve_staff = None
                if cd.get('approved_by'):
                    try:
                        approve_staff = Staff.objects.get(user__username = cd['approved_by'])
                    except Staff.DoesNotExist:
                        print(f"Warning: Staff '{cd['approved_by']}' not found.")

                b, created = Batch.objects.get_or_create(
                    title = cd['title'],
                    full_name = cd['full_name'],
                    whiteboard_name = cd['whiteboard_name'],

                    date_batch_submitted = cd['date_batch_submitted'],
                    scheduled_start = cd['scheduled_start'],
                    report_sent = cd['report_sent'],

                    submitter_lab = SubmitterLab.objects.get(name = cd['submitter_lab']),
                    number_of_samples = cd['number_of_samples'],
                    radionuclide = Radionuclide.objects.get(name = cd['radionuclide']),
                    source = Machine.objects.get(machine_name = cd['source']),
                    
                    comment = cd['comment'],
                    approved_by = approve_staff
                )
            
            if cat == Event:
                asso_machine = None
                if cd.get('asso_machine'):  # Avoid KeyError
                    try:
                        asso_machine = Machine.objects.get(machine_name=cd['asso_machine'])
                    except Machine.DoesNotExist:
                        print(f"Warning: Machine '{cd['asso_machine']}' not found.")

                retrieved_batch = None
                if cd.get('asso_batch'):
                    try:
                        retrieved_batch = Batch.objects.filter(title=cd['asso_batch'])
                    except Batch.DoesNotExist:
                        print(f"Warning: Batch '{cd['asso_batch']}' not found.")

                event_type = cd.get('event_type')

                if issubclass(event_type, Event):
                    e, created = event_type.objects.get_or_create(
                        title = cd['title'],
                        description = cd.get('description'),
                        responsible_staff = Staff.objects.get(user__username = cd['responsible_staff']),
                        
                        start = cd['start'],
                    )

                    if type(event_type) == BatchProcessingEvent:
                        e.asso_batch = retrieved_batch
                        e.end = cd['end']

                    elif type(event_type) == StaffAwayEvent:
                        e.away_type = StaffAwayEvent.StaffAway.LEAVE
                        e.end = cd['end']

                    elif type(event_type) == MaintenanceEvent:
                        e.asso_machine = asso_machine
                        e.report_date = cd.get('reported_date')
                        e.scheduled_date = cd.get('scheduled_date')
                        e.scheduled = cd['scheduled']
                        e.status = cd['status']
                        
                        if cd.get['end']:
                            e.end = cd['end']
                        else:
                            e.end = e.start + timedelta(week=1)
                    
                    e.save()

                else:
                    print(f"Warning: Class of '{cd['title']}' is not a subclass of Event, but a '{event_type}'.")

if __name__ == '__main__':

    print('Starting Digical population script...')
    populate()