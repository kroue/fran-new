from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Generate a verification code
        verification_code = get_random_string(6, allowed_chars='0123456789')

        # Store the code in a temporary way, could use a model or cache (like Redis)
        user.profile.verification_code = verification_code  # Assuming UserProfile model
        user.profile.save()

        # Send email to user with the code
        subject = 'Verify your email address'
        message = render_to_string('verification_email.html', {
            'user': user,
            'verification_code': verification_code,
            'domain': get_current_site(self.context['request']).domain
        })

        send_mail(subject, message, 'noreply@yourdomain.com', [user.email])

        return user
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user