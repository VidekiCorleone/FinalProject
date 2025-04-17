using project_alpha_0._1.osztalyok;
using project_alpha_0._1.userCoontrol_ok;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class userEdit : Form
    {

        

        public userEdit()
        {
            InitializeComponent();
            
            Start();

            button1.Click += backBtn;
            button2.Click += deleteBtn;
            button3.Click += modifyBtn;
            button4.Click += addBtn;

            LoadUserControls();
        }


        private async void LoadUserControls()
        {

            try
            {
                int xPosition = 0;
                int yPosition = 0;
                int controlWidth = (panel1.Width - SystemInformation.VerticalScrollBarWidth) / 2; // Adjust based on the actual width of userControlProfile
                panel1.Width = controlWidth * 2 + SystemInformation.VerticalScrollBarWidth;
                int controlHeight = 175; // Adjust based on the actual height of userControlProfile

                HttpRequestek request = new HttpRequestek();

                List<UserProfile> userProfiles = await request.getUserProfiles();

                panel1.Controls.Clear();


                for (int i = 0; i < userProfiles.Count; i++)
                {
                    var user = userProfiles[i];

                    var userProfileControl = new userControlProfile()
                    {
                        userID = user.id,
                        textBox1 = { Text = user.name },
                        textBox2 = { Text = user.username },
                        textBox3 = { Text = user.email },
                        textBox4 = { Text = user.phone_num },
                        textBox5 = { Text = "" } // Password is not displayed
                    };

                    userProfileControl.Location = new Point(xPosition, yPosition);
                    userProfileControl.Size = new Size(controlWidth, controlHeight);

                    panel1.Controls.Add(userProfileControl);

                    if ((i + 1) % 2 == 0)
                    {
                        xPosition = 0;
                        yPosition += controlHeight;
                    }
                    else
                    {
                        xPosition += controlWidth;
                    }
                }
            }
            catch (Exception e)
            {
                MessageBox.Show("Valami nagyon el van baszva ", e.Message);
            }
        }



        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Felhasználók kezelése";
            button1.Text = "Vissza";
            button2.Text = "Törlés";
            button3.Text = "Módosítás";
            button4.Text = "Hozzáadás";

            panel1.AutoScroll = true;

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            int button2Mid = button2.Width / 2;
            int button3Mid = button3.Width / 2;
            int button4Mid = button4.Width / 2;
            int panel1Mid = panel1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            panel1.Left = this.Width / 2 - panel1Mid;
            button1.Left = panel1.Left;
            button2.Left = button1.Left + button1.Width + 6;
            button3.Left = button2.Left + button2.Width + 6;
            button4.Left = button3.Left + button3.Width + 6;
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                Menu menuForm = new Menu();
                menuForm.ShowDialog();
                //this.Close();
            }
        }

        public void deleteBtn(object s, EventArgs e)
        {
            const string message = "Fejlesztés alatt";
            const string caption = "Hiba";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.OK,
                                         MessageBoxIcon.Error);
        }

        public void modifyBtn(object s, EventArgs e)
        {
            //const string message = "Fejlesztés alatt";
            //const string caption = "Hiba";
            //var result = MessageBox.Show(message, caption,
            //                             MessageBoxButtons.OK,
            //                             MessageBoxIcon.Error);

            this.Hide();
            userEditEdit userEditEditForm = new userEditEdit();
            userEditEditForm.ShowDialog();
        }

        public void addBtn(object s, EventArgs e)
        {
            //const string message = "Fejlesztés alatt";
            //const string caption = "Hiba";
            //var result = MessageBox.Show(message, caption,
            //                             MessageBoxButtons.OK,
            //                             MessageBoxIcon.Error);

            this.Hide();
            userEditAdd userEditAddForm = new userEditAdd();
            userEditAddForm.ShowDialog();
        }
    }
}
