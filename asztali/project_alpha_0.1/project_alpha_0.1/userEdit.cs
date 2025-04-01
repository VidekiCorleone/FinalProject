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


        private void LoadUserControls()
        {
            userControlProfile profileControl = new userControlProfile();
            List<userData> userDataList = profileControl.GetUserData();

            panel1.Controls.Clear();
            int controlsPerRow = 2;
            int controlWidth = (panel1.Width - SystemInformation.VerticalScrollBarWidth - 16) / 2; // Adjust based on the actual width of userControlProfile
            int controlHeight = 175; // Adjust based on the actual height of userControlProfile
            HashSet<string> addedUsernames = new HashSet<string>();

            for (int i = 0; i < userDataList.Count; i++)
            {
                var userData = userDataList[i];
                if (addedUsernames.Contains(userData.username))
                {
                    continue; // Skip if the user has already been added
                }

                userControlProfile userControl = new userControlProfile();
                userControl.textBox1.Text = userData.name;
                userControl.textBox2.Text = userData.username;
                userControl.textBox3.Text = userData.email;
                userControl.textBox4.Text = userData.phoneNumber.ToString();

                int row = i / controlsPerRow;
                int col = i % controlsPerRow;

                userControl.Location = new System.Drawing.Point(
                    col * (controlWidth),
                    row * (controlHeight)
                );

                panel1.Controls.Add(userControl);
                addedUsernames.Add(userData.username); // Add the username to the set
            }
        }



        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.BackColor = Color.FromArgb(93, 135, 54);

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
