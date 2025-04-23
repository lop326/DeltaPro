from django.urls import path
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('register/',views.registration, name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', views.home , name='home'),
    path('gauss/', views.gauss, name= 'gauss'),
    path('gauss_jordan/', views.gauss_jordan, name= 'gauss_jordan'),
    path('nosotros/', views.nosotros, name='nosotros'),
    path('raices/',views.mRaices, name='raices'),
    path('sistemas/',views.mSistemas, name='sistemas'),
    path('ayuda/', views.ayuda, name='ayuda'),
    path('actualizar_perfil/',views.actualizar_perfil, name='actualizar_perfil'),
    path('gauss_seidel/', views.gauss_seidel ,name='gauss_seidel'),
    path('secante/', views.secante ,name='secante'),
    path('biseccion/', views.biseccion ,name='biseccion'),
    path('regula_falsi/', views.regula_falsi ,name='regula_falsi'),
    path('jacobi/', views.jacobi ,name='jacobi'),
    path('newton/', views.newton ,name='newton'),

]


