import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    isEditMode = false;
    userId: number | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.userForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            firstName: [''],
            lastName: [''],
            companyName: [''],
            creditsRemaining: [0],
            roles: [[]]   // ✅ ADD THIS
        });

    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.userId = +params['id'];
                this.loadUser(this.userId);
            }
        });
    }

    loadUser(id: number): void {
        this.loading = true;
        this.userService.getUserProfile(id).subscribe({
            next: (user) => {
                this.userForm.patchValue({
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    companyName: user.companyName,
                    creditsRemaining: user.creditsRemaining,

                    // ✅ convert Role objects → string array
                    roles: user.roles?.map((r: any) => r.name) || []
                });


                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading user:', error);
                this.loading = false;
            }
        });
    }

    onRoleChange(event: any) {
        const currentRoles = this.userForm.value.roles as string[];
        const value = event.target.value;

        let roles = [...currentRoles];

        if (event.target.checked) {
            if (!roles.includes(value)) {
                roles.push(value);
            }
        } else {
            roles = roles.filter(r => r !== value);
        }

        this.userForm.patchValue({ roles });
    }



    onSubmit(): void {
        if (this.userForm.valid) {
            this.loading = true;

            // 🔥 FIX 3: remove null / empty values
            const userData = Object.fromEntries(
                Object.entries(this.userForm.value).filter(([_, v]) =>
                    v !== null && v !== ''
                )
            );

            const request = this.isEditMode && this.userId
                ? this.userService.updateUserProfile({ ...userData, id: this.userId })
                : this.userService.createUser(userData);

            request.subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['admin-dashboard/user-list']);
                },
                error: (error) => {
                    console.error('Error saving user:', error);
                    this.loading = false;
                }
            });
        }
    }


    onCancel(): void {
        this.router.navigate(['../user-list']);
    }
}