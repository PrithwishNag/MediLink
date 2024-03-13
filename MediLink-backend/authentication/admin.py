from django.contrib import admin
from .models import Hospital, InsuranceCompany
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

admin.site.unregister(User)

class MyUserAdmin(UserAdmin):
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}
        ),
    )

admin.site.register(User, MyUserAdmin)
admin.site.register(Hospital)
admin.site.register(InsuranceCompany)