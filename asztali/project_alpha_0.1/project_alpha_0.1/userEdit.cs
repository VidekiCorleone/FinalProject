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
            button4.Click += addBtn;
            
            LoadUserControls();

            textBox1.TextChanged += btnSearch_Click;
        }
        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);
            label2.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Felhasználók kezelése";
            label2.Text = "Szűrés felhasználónévre:";
            button1.Text = "Vissza";
            button4.Text = "Hozzáadás";

            panel1.AutoScroll = true;

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            int button4Mid = button4.Width / 2;
            int panel1Mid = panel1.Width / 2;
            int label2Mid = label2.Width / 2;
            int textBox1Mid = textBox1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            panel1.Left = this.Width / 2 - panel1Mid;
            button1.Left = panel1.Left;
            button4.Left = button1.Left + button1.Width + 6;
            label2.Left = button4.Left + button4.Width + 6;
            label2.Top = button1.Top + button1.Height / 2 - label2.Height / 2;
            textBox1.Top = button1.Top + button1.Height / 2 - textBox1.Height / 2;
            textBox1.Left = panel1.Left + panel1.Width - textBox1.Width;
        }

        private async void LoadUserControls(string search = "")
        {

            try
            {
                int xPosition = 0;
                int yPosition = 0;
                int controlWidth = (panel1.Width - SystemInformation.VerticalScrollBarWidth) / 2;
                panel1.Width = controlWidth * 2 + SystemInformation.VerticalScrollBarWidth;
                int controlHeight = 175; 

                HttpRequestek request = new HttpRequestek();

                List<UserProfile> userProfiles = await request.getUserProfiles();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    userProfiles = userProfiles.Where(u => u.username.Contains(search)).ToList();
                }

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
                        textBox5 = { Text = "" }
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
                MessageBox.Show("Hiba történt: ", e.Message);
            }
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                Menu menuForm = new Menu();
                menuForm.Show();
            }
        }

        public void addBtn(object s, EventArgs e)
        {
            this.Hide();
            userEditAdd userEditAddForm = new userEditAdd();
            userEditAddForm.Show();
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string searchText = textBox1.Text.Trim();
            LoadUserControls(searchText);
        }
    }
}
